import { type ReactNode, useState } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Link } from "react-router-dom";

import { useRouteChange } from "../hooks";

function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <main className="text-center mt-5 bg-danger text-white rounded mx-auto w-50 p-5">
      <h1 className="mb-4">קרתה שגיאה בלתי צפויה</h1>
      {error?.message && <h3>{error.message}</h3>}
      <div>
        <button
          className="mx-3 mt-4 p-2 rounded bg-white text-dark fs-4 text-decoration-none border-0 border-none"
          onClick={resetErrorBoundary}
          type="button"
        >
          טען מחדש
        </button>
        <Link
          className="mx-3 mt-4 p-2 rounded bg-white text-dark fs-4 text-decoration-none border-0 border-none"
          onClick={resetErrorBoundary}
          to="/"
          type="button"
        >
          לדף הבית
        </Link>
      </div>
    </main>
  );
}

interface PageErrorBoundaryProps {
  children: ReactNode;
}

function PageErrorBoundary({ children }: PageErrorBoundaryProps) {
  const [resetKey, setResetKey] = useState<number>(0);
  useRouteChange(() => setResetKey((prev) => prev + 1));

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} resetKeys={[resetKey]}>
      {children}
    </ErrorBoundary>
  );
}

export default PageErrorBoundary;
