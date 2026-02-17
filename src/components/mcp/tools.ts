import { tool, type Tool } from "ai";
import { Page } from "playwright";
import { z } from "zod";

export type ToolType = Record<string, Tool>;

let actionQueue: Promise<any> = Promise.resolve();

export const getAvailableTools = (page: Page): ToolType => {

  // Ensure simultaneous fill actions are executed sequentially
  const queueAction = <T>(action: () => Promise<T>): Promise<T> => {
    const result = actionQueue.then(action);
    actionQueue = result.catch(() => {});
    return result;
  };

  return {
    // Input fields
    fillField: tool({
      description: "Fill a text input field",
      parameters: z.object({
        label: z.string().describe("The name, label, or placeholder of the input field"),
        value: z.string().describe("The text to type into the field"),
      }),
      execute: async ({ label, value }) => queueAction(async () => {
        const locator = page.getByRole('textbox', { name: label })
            .or(page.getByPlaceholder(label))
            .or(page.getByLabel(label));
        const element = locator.first();
        const elementType = await element.getAttribute('type').catch(() => null);

        if (elementType === 'date') {
          const parsedDate = new Date(value);
          if (!isNaN(parsedDate.getTime())) {
            value = parsedDate.toISOString().split('T')[0];
          }
        }
        await element.fill(value);
        await element.blur(); // Triggers validation
        
        return `Filled '${label}'`;
      })
    }),
    // Dropwdowns
    selectOption: tool({
      description: "Select an option from a dropdown menu",
      parameters: z.object({
        label: z.string().describe("The label of the dropdown field"),
        option: z.string().describe("The exact text of the option to select"),
      }),
      execute: async ({ label, option }) => queueAction(async () => {
        // Try custom dropdowns in case standard <select> did not work
        try {
            const locator = page.getByLabel(label).or(page.getByRole('combobox', { name: label }));
            const element = locator.first();

            await element.selectOption({ label: option });
            return `Selected '${option}' via standard select`;
        } catch (e) {
            // Try clicking the dropdown trigger
            await page.getByLabel(label).or(page.getByRole('combobox', { name: label })).first().click();
            // Try waiting for the option to appear first
            await page.getByRole('option', { name: option }).first().click();
        }

        const newSnapshot = await page.locator("body").ariaSnapshot();
        return `Selected '${option}' in '${label}'.
            
            --- UPDATED PAGE CONTEXT ---
            ${newSnapshot}`;
      }),
    }),
    // Expand/toggle
    toggleSection: tool({
      description: "Click an arrow, icon, or heading to expand a hidden section.",
      parameters: z.object({
        name: z.string().describe("The text near the arrow or the section title"),
      }),
      execute: async ({ name }) => queueAction(async () => {        
        const locator = page.getByRole('button', { name })
          .or(page.getByRole('button').filter({ hasText: name }))

        const element = locator.first();
        await element.click();
        
        // Wait, for animations, delays etc.
        await page.waitForTimeout(500); 

        const newSnapshot = await page.locator("body").ariaSnapshot();
        return `SUCCESS: Toggled section '${name}'.
        
        --- UPDATED PAGE CONTEXT ---
        ${newSnapshot}`;
      }),
    }),
    // Button
    clickButton: tool({
      description: "Click a button",
      parameters: z.object({
        name: z.string().describe("The text on the button"),
      }),
      execute: async ({ name }) => {
        await page.getByRole('button', { name }).first().click();
        return `Clicked button '${name}'`;
      },
    })
  }
}