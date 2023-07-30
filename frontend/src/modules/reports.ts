export const reportTableHeaders = [
  { id: 0, path: "שם מלא" },
  { id: 1, path: "אחראי" },
  { id: 2, path: "נהג" },
  { id: 3, path: "תאריך" },
  { id: 4, path: "קיבל/ה" },
];

export const reportCompletionHeaders = [
  { id: 0, path: "שם מלא" },
  { id: 1, path: "נהג" },
  { id: 2, path: "רחוב" },
];

export const reportCompletionBuilder = [
  { id: 0, path: "שם מלא" },
  { id: 2, path: "רחוב" },
];

export type CompletionFamily = { "שם מלא": string; נהג: string; רחוב: string };

export const reportReceiveProp = "קיבל/ה";
export const reportDateProp = "תאריך";
