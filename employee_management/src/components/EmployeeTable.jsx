import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchEmployees,
  deleteEmployee,
  addEmployee,
  updateEmployee,
  clearLastAction,
} from "../features/employeesSlice";
import LoadingSpinner from "./LoadingSpinner";
import ConfirmDialog from "./ConfirmDialog";
import EmployeeModal from "./EmployeeModal";
import SearchFilterSort from "./SearchFilterSort";
import { ROLE_OPTIONS } from "../utils/roles";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

export default function EmployeeTable() {
  const dispatch = useDispatch();
  const { items, status, error, lastActionSuccess } = useSelector(
    (s) => s.employees
  );

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
      out = out.filter(
        (e) =>
          e.name.toLowerCase().includes(val) ||
          e.email.toLowerCase().includes(val)
      );
    }
    if (role) out = out.filter((e) => e.role === role);

    out.sort((a, b) => {
      const A = a[sortBy];
      const B = b[sortBy];
      if (typeof A === "string") {
        return sortDir === "asc" ? A.localeCompare(B) : B.localeCompare(A);
      }
      return sortDir === "asc" ? (A || 0) - (B || 0) : (B || 0) - (A || 0);
    });
    return out;
  }, [items, q, role, sortBy, sortDir]);

  return (
    <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 min-h-screen text-gray-900">
      <header className="pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3 drop-shadow-md">
          <FaUsers className="w-8 h-8 sm:w-10 sm:h-10 text-blue-200" />
          Employee Management Portal
        </h1>
      </header>

      <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-xl border border-white/20">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            Employees
          </h2>
          <button
            onClick={openAdd}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:from-green-600 hover:to-emerald-700 transition-all w-full sm:w-auto shadow-sm hover:shadow-md cursor-pointer"
          >
            + Add Employee
          </button>
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

          {status === "failed" && (
            <div className="p-4 bg-red-100 text-red-800 rounded-lg border border-red-300">
              {error}
            </div>
          )}

          {lastActionSuccess && (
            <div className="p-3 bg-green-100 border border-green-200 rounded-lg text-green-800 my-3 text-center sm:text-left">
              {lastActionSuccess}
            </div>
          )}

          <div className="md:hidden grid grid-cols-1 gap-4 mt-3">
            {filtered.map((e) => (
              <div
                key={e.id}
                className="bg-white rounded-xl p-4 shadow-md border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{e.name}</h3>
                    <p className="text-sm text-gray-500">{e.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(e)}
                      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 transition-all"
                    >
                      <MdEdit size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteClick(e.id)}
                      className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-all"
                    >
                      <MdDelete size={18} />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mt-2">
                  <span className="font-medium text-gray-600">Role:</span>{" "}
                  {e.role}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Employee ID: {e.id}
                </div>
              </div>
            ))}

            {filtered.length === 0 && status === "succeeded" && (
              <div className="p-4 text-center text-gray-500">
                No employees found.
              </div>
            )}
          </div>

          <div className="hidden md:block overflow-x-auto mt-4 rounded-xl border border-gray-200 shadow-sm">
            <table className="min-w-full bg-white text-sm sm:text-base">
              <thead className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">ID</th>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Email</th>
                  <th className="px-4 py-3 text-left font-semibold">Role</th>
                  <th className="px-4 py-3 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e, i) => (
                  <tr
                    key={e.id}
                    className={`${
                      i % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-4 py-2">{e.id}</td>
                    <td className="px-4 py-2">{e.name}</td>
                    <td className="px-4 py-2">{e.email}</td>
                    <td className="px-4 py-2">{e.role}</td>
                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => openEdit(e)}
                          className="text-blue-600 hover:text-blue-800 p-1 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={() => onDeleteClick(e.id)}
                          className="text-red-600 hover:text-red-800 p-1 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && status === "succeeded" && (
              <div className="p-4 text-center text-gray-500">
                No employees match your search/filter.
              </div>
            )}
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
