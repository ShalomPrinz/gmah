export const editFamilyInputs = [
  { id: 0, label: "שם מלא", path: "שם מלא" },
  { id: 1, label: "רחוב", path: "רחוב" },
  { id: 2, label: "בניין", path: "בניין" },
  { id: 3, label: "דירה", path: "דירה" },
  { id: 4, label: "קומה", path: "קומה" },
  { id: 5, label: "מס' בית", path: "מס$ בית" },
  { id: 6, label: "מס' פלאפון", path: "מס$ פלאפון" },
  { id: 7, label: "נהג", path: "נהג" },
  { id: 8, label: "ממליץ", path: "ממליץ" },
  { id: 9, label: "הערות", path: "הערות", doubleSize: true },
];

export const addFamilyHeaders = [
  { id: 0, label: "שם מלא", path: "שם מלא" },
  { id: 1, label: "רחוב", path: "רחוב" },
  { id: 2, label: "בניין", path: "בניין" },
  { id: 3, label: "דירה", path: "דירה" },
  { id: 4, label: "קומה", path: "קומה" },
  { id: 5, label: "מס' בית", path: "מס$ בית" },
  { id: 6, label: "מס' פלאפון", path: "מס$ פלאפון" },
  { id: 8, label: "ממליץ", path: "ממליץ" },
];

export const familiesTableHeaders = [
  { id: 0, path: "שם מלא" },
  { id: 1, path: "רחוב" },
  { id: 2, path: "בניין" },
  { id: 3, path: "דירה" },
  { id: 4, path: "קומה" },
  { id: 5, path: "מס' בית" },
  { id: 6, path: "מס' פלאפון" },
  { id: 7, path: "נהג" },
  { id: 8, path: "ממליץ" },
];

export const familiesHistoryTableHeaders = [
  { id: 0, path: "שם מלא" },
  { id: 1, path: "רחוב" },
  { id: 2, path: "בניין" },
  { id: 3, path: "דירה" },
  { id: 4, path: "קומה" },
  { id: 5, path: "מס' בית" },
  { id: 6, path: "מס' פלאפון" },
  { id: 7, path: "ממליץ" },
  { id: 8, path: "תאריך יציאה" },
  { id: 9, path: "סיבה" },
];

export const familyProperties = [
  "שם מלא",
  "רחוב",
  "בניין",
  "דירה",
  "קומה",
  "מס' בית",
  "מס' פלאפון",
  "נהג",
  "ממליץ",
  "הערות",
];

export const defaultFamily = {
  "שם מלא": "",
  רחוב: "",
  בניין: "",
  דירה: "",
  קומה: "",
  "מס$ בית": "",
  "מס$ פלאפון": "",
  נהג: "",
  ממליץ: "",
  הערות: "",
};

export type Family = {
  "שם מלא": string;
  רחוב: string;
  בניין: string;
  דירה: string;
  קומה: string;
  "מס' בית": string;
  "מס' פלאפון": string;
  נהג: string;
  ממליץ: string;
  הערות: string;
};

export type FormFamily = {
  "שם מלא": string;
  רחוב: string;
  בניין: string;
  דירה: string;
  קומה: string;
  "מס$ בית": string;
  "מס$ פלאפון": string;
  נהג: string;
  ממליץ: string;
  הערות: string;
};

export const familyIdProp = "שם מלא";
