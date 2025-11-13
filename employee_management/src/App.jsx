import { ErrorBoundary } from "react-error-boundary";
import EmployeeTable from "./components/EmployeeTable";

function ErrorFallback({ error }) {
  return (
    <div className="p-6 m-6 bg-red-50 border border-red-200 rounded">
      <h2 className="text-red-800 font-semibold">Something went wrong.</h2>
      <p className="text-sm text-red-600">{error.message}</p>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <EmployeeTable />
    </ErrorBoundary>
  );
}
