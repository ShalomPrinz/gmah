import { useEffect, useState } from "react";

import { getFamiliesCount } from "../services";

function Home() {
  const { familiesCount, isLoading } = useFamiliesCount();

  return (
    <main className="m-5 text-center">
      <h1>ברוך הבא!</h1>
      מספר המשפחות בגמ&quot;ח: {isLoading ? "טוען..." : familiesCount}
    </main>
  );
}

export function useFamiliesCount() {
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    getFamiliesCount()
      .then((res) => setCount(res.data.familiesCount))
      .catch((error) =>
        console.error(
          "Error occurred while trying to get families count",
          error
        )
      )
      .finally(() => setLoading(false));
  }, []);

  return { familiesCount: count, isLoading: loading };
}

export default Home;
