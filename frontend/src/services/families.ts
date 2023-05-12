import { toast } from "react-toastify";

import { get, post } from "./http";

async function getFamiliesCount() {
  return get("familiesCount");
}

async function searchFamilies(query: string, by: string) {
  return get("families", { params: { query, by } });
}

/**
 * Posts families to database.
 *
 * If error occurres, any "then" callback will recieve a string instead of a
 * standard AxiosResponse. If there was an error in a family property, the string
 * will be this family's name. If there was an unexpected error, the string will
 * simply be "Unexpected".
 */
async function addFamilies(families: any) {
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

export { addFamilies, getFamiliesCount, searchFamilies };
