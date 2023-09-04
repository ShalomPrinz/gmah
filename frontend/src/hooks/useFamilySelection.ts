import { useState } from "react";
import { familyIdProp, type Family } from "../modules";

function useFamilySelection() {
  const [selected, setSelected] = useState<Family | undefined>(undefined);
  const setNoSelectedFamily = () => setSelected(undefined);
  const isFamilySelected = typeof selected !== "undefined";
  const selectedFamilyName = isFamilySelected ? selected[familyIdProp] : "";

  return {
    isFamilySelected,
    selected,
    setSelected,
    setNoSelectedFamily,
    selectedFamilyName,
  };
}

export { useFamilySelection };
