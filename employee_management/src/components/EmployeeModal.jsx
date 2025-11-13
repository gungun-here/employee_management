import React, { useEffect, useState } from "react";
import { ROLE_OPTIONS } from "../utils/roles";

export default function EmployeeModal({ open, onClose, onSubmit, initial }) {
  const [form, setForm] = useState({ name: "", email: "", role: ROLE_OPTIONS[2] });

  useEffect(() => {
    if (open) {
      if (initial) setForm({ name: initial.name || "", email: initial.email || "", role: initial.role || ROLE_OPTIONS[2] });
      else setForm({ name: "", email: "", role: ROLE_OPTIONS[2] });
    }
  }, [open, initial]);

  if (!open) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function submit(e) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      alert("Name and email are required");
      return;
    }
    // if editing, include id
    if (initial && initial.id) {
      onSubmit({ ...initial, ...form });
    } else {
      onSubmit({ ...form });
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4">
      <div className="bg-white rounded shadow-lg max-w-lg w-full p-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{initial ? "Edit Employee" : "Add Employee"}</h3>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>
        <form onSubmit={submit} className="mt-4 grid gap-3">
          <label className="flex flex-col">
            <span className="text-sm">Full name</span>
            <input name="name" value={form.name} onChange={handleChange} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm">Email</span>
            <input name="email" value={form.email} onChange={handleChange} className="border rounded px-3 py-2" />
          </label>
          <label className="flex flex-col">
            <span className="text-sm">Role</span>
            <select name="role" value={form.role} onChange={handleChange} className="border rounded px-3 py-2">
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>

          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-3 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-3 py-2 rounded bg-blue-600 text-white">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
