import { type ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";
import { Link } from "react-router-dom";

function ErrorFallback({ error }: FallbackProps) {
  return (
    <main className="text-center mx-auto bg-danger text-white p-5 w-50 mt-5 rounded">
      <span className="mb-5" style={{ fontSize: "50px" }}>
        קרתה שגיאה בלתי צפויה
      </span>
      {error?.message && <h1 className="my-5">{error.message}</h1>}
      <Link
        className="mx-3 mt-5 p-2 rounded bg-white text-dark fs-4 text-decoration-none border-0 border-none"
        onClick={window.location.reload}
        to="/"
        type="button"
      >
        <span className="fs-2 p-3">טען את האפליקציה מחדש</span>
      </Link>
    </main>
  );
}

interface AppErrorBoundaryProps {
  children: ReactNode;
}

function AppErrorBoundary({ children }: AppErrorBoundaryProps) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>{children}</ErrorBoundary>
  );
}

export default AppErrorBoundary;
