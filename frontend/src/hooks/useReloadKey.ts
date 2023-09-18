import { useState } from "react";

function useReloadKey() {
  const [reloadKey, setReloadKey] = useState(0);

  function updateKey() {
    setReloadKey((prev) => prev + 1);
  }

  return { reloadKey, updateKey };
}

export { useReloadKey };
