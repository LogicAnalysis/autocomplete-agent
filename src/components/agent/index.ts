import { generateText } from "ai";
import fs from "fs";
import path from "path";
import { Page } from "playwright";
import { model } from "../../_internal/setup";
import { ToolType } from '../mcp';

const BASE_PROMPT = fs.readFileSync(path.join(__dirname, 'basePrompt.txt'), 'utf-8');

const MAX_STEPS = 20;

export async function fillFormWithAgent(page: Page, dataToFill: string, availableTools: ToolType) {
  // Using ariaSnapshot for clean list of interactions available on the page
  const pageContext = await page.locator("body").ariaSnapshot();

  try {
    const { text, steps } = await generateText({
      model,
      tools: availableTools,
      system: BASE_PROMPT,
      maxSteps: MAX_STEPS, 
      prompt: `
        --- SOURCE DATA ---
        ${dataToFill}
        
        --- PAGE CONTEXT (ARIA SNAPSHOT) ---
        ${pageContext}
      `,
    });

    return {
      success: true,
      finalResponse: text,
      stepsTaken: steps.length
    };

  } catch (error) {
    return {
      success: false,
      error: error
    };
  }

}