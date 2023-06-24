import { post } from "./http";

function generateMonthReport(name: string) {
  return post("/generate/month", { name });
}

export { generateMonthReport };
