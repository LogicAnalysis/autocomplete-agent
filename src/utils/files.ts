import fs from "fs";
import path from "path";
import { Task } from "../types";

export const jsonDataReader = (DATA_FILE: string) => {
  const dataPath = path.join(process.cwd(), "src", "data", DATA_FILE);
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const tasks: Task[] = JSON.parse(rawData);

  return tasks;
}