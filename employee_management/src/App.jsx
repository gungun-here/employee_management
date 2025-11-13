import React from "react";
import EmployeeTable from "./components/EmployeeTable";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
     

      
          <EmployeeTable />
        
      
    </ErrorBoundary>
  );
}
