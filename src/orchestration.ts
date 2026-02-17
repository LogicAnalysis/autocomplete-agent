import { fillFormWithAgent } from "./components/agent";
import { getAvailableTools } from './components/mcp';
import { DATA_FILE } from "./const";
import { jsonDataReader } from "./utils/files";
import { createSession } from "./utils/session";

async function Orchestrator() {
  // Read the JSON file
  const tasks = jsonDataReader(DATA_FILE);

  // Start a single browser session (for efficiency)
  const page = await createSession("about:blank");

  // Iterate through tasks
  for (const task of tasks) {    
    // Navigate to the URL
    await page.goto(task.website);
    
    // Run the agent
    try {
      const pageTools = getAvailableTools(page);
      await fillFormWithAgent(page, task.data, pageTools);
      
      // Uncomment this to slow down execution, and better see the actions visually
      //await page.waitForTimeout(2000); 
    } catch (error) {
      console.error(`Error processing ${task.website}:`, error);
    }
  }

  console.log("\nAll tasks completed.");
  // Uncomment this to close the browser on completion
  //await page.context().browser()?.close(); 
}

export default Orchestrator