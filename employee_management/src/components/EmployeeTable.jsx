import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  deleteEmployee,
  addEmployee,
  updateEmployee,
  clearLastAction
} from "../features/employeesSlice";
import LoadingSpinner from "./LoadingSpinner";
import ConfirmDialog from "./ConfirmDialog";
import EmployeeModal from "./EmployeeModal";
import SearchFilterSort from "./SearchFilterSort";
import { ROLE_OPTIONS } from "../utils/roles";

export default function EmployeeTable() {
  const dispatch = useDispatch();
  const { items, status, error, lastActionSuccess } = useSelector((s) => s.employees);

  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchEmployees());
  }, [dispatch]);

  useEffect(() => {
    if (lastActionSuccess) {
      const t = setTimeout(() => dispatch(clearLastAction()), 2200);
      return () => clearTimeout(t);
    }
  }, [lastActionSuccess, dispatch]);

  function openAdd() {
    setEditing(null);
    setModalOpen(true);
  }
  function openEdit(emp) {
    setEditing(emp);
    setModalOpen(true);
  }
  function onDeleteClick(id) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }
  function confirmDelete() {
    if (pendingDeleteId != null) {
      dispatch(deleteEmployee(pendingDeleteId));
    }
    setConfirmOpen(false);
  }

  const filtered = useMemo(() => {
    let out = [...items];
    if (q.trim()) {
      const val = q.toLowerCase();
      out = out.filter((e) => e.name.toLowerCase().includes(val) || e.email.toLowerCase().includes(val));
    }
    if (role) out = out.filter((e) => e.role === role);

    out.sort((a, b) => {
      const A = a[sortBy];
      const B = b[sortBy];
      if (typeof A === "string") {
        if (sortDir === "asc") return A.localeCompare(B);
        return B.localeCompare(A);
      }
      if (sortDir === "asc") return (A || 0) - (B || 0);
      return (B || 0) - (A || 0);
    });
    return out;
  }, [items, q, role, sortBy, sortDir]);

  return (
    <div className="p-5 bg-[var(--blue)] min-h-screen w-full">
       <header>
                <div className="py-4">
                  <h1 className="text-2xl font-bold text-white">Employee Management Portal</h1>
                </div>
              </header>
       <div className="bg-gray-50 p-5 rounded-xl">
             
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employees</h2>
        <div className="flex gap-2">
          <button onClick={openAdd} className="px-3 py-2 rounded bg-green-600 text-white cursor-pointer">
            + Add
          </button>
        </div>
      </div>

      <SearchFilterSort
        q={q}
        setQ={setQ}
        role={role}
        setRole={setRole}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDir={sortDir}
        setSortDir={setSortDir}
        roleOptions={ROLE_OPTIONS}
      />

      <div className="mt-4">
        {status === "loading" && <LoadingSpinner />}

        {status === "failed" && <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>}

        {lastActionSuccess && <div className="p-3 bg-green-50 border border-green-200 rounded text-green-800 my-3">{lastActionSuccess}</div>}

        <div className="overflow-x-auto mt-2">
          <table className="min-w-full bg-white border rounded">
            <thead>
              <tr className="text-left">
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Role</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{e.id}</td>
                  <td className="px-4 py-2 border-b">{e.name}</td>
                  <td className="px-4 py-2 border-b">{e.email}</td>
                  <td className="px-4 py-2 border-b">{e.role}</td>
                  <td className="px-4 py-2 border-b">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(e)} className="px-2 py-1 border rounded">
                        Edit
                      </button>
                      <button onClick={() => onDeleteClick(e.id)} className="px-2 py-1 border rounded text-red-600">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && status === "succeeded" && <div className="p-4 text-center text-gray-500">No employees match your search/filter.</div>}
        </div>
      </div>

      <EmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        initial={editing}
        onSubmit={(data) => {
          if (data.id) {
            dispatch(updateEmployee(data));
          } else {
            const newEmp = { ...data, role: data.role || ROLE_OPTIONS[2] };
            dispatch(addEmployee(newEmp));
          }
          setModalOpen(false);
        }}
      />

      <ConfirmDialog
        open={confirmOpen}
        title="Delete employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
      </div>
    </div>
  );
}
