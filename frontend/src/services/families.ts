import { toast } from "react-toastify";

import { get, post, put, remove } from "./http";

import type { Family } from "../modules";

async function getFamiliesCount() {
  return get("familiesCount");
}

async function searchFamilies(query: string, by: string) {
  return get("families", { params: { query, by } });
}

async function searchFamiliesHistory(query: string, by: string) {
  return get("families/history", { params: { query, by } });
}

/**
 * Posts families to database.
 *
 * If error occurres, any "then" callback will recieve a string instead of a
 * standard AxiosResponse. If there was an error in a family property, the string
 * will be this family's name. If there was an unexpected error, the string will
 * simply be "Unexpected".
 */
async function addFamilies(families: Family[]) {
  return post("families", families).catch((error) => {
    let familyName = "Unexpected";

    if (
      error?.response?.data?.description &&
      error?.response?.data?.family_name
    ) {
      const { description, family_name } = error.response.data;
      toast.error(`קרתה תקלה בהוספת המשפחה ${family_name}: ${description}`);
      familyName = family_name;
    } else {
      toast.error("קרתה תקלה לא צפויה. אם הבעיה ממשיכה אנא פנה לשלום");
    }

    return familyName; // Signal to a follower "then" callback which family caused error
  });
}

async function updateFamily(originalName: string, familyData: Family) {
  return put("family", {
    original_name: originalName,
    family_data: familyData,
  });
}

async function removeFamily(
  familyName: string,
  exitDate: string,
  reason: string
) {
  return remove("family/remove", {
    params: {
      family_name: familyName,
      exit_date: exitDate,
      reason,
    },
  });
}

async function restoreFamily(familyName: string) {
  return post("family/restore", {
    family_name: familyName,
  });
}

export {
  addFamilies,
  getFamiliesCount,
  searchFamilies,
  searchFamiliesHistory,
  updateFamily,
  removeFamily,
  restoreFamily,
};
