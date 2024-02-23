type familyDataType = "regular" | "holiday";

interface RemoveFamilyData {
  familyName: string;
  from: familyDataType;
}

export type { familyDataType, RemoveFamilyData };
