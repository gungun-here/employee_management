
export default function SearchFilterSort({
  q,
  setQ,
  role,
  setRole,
  sortBy,
  setSortBy,
  sortDir,
  setSortDir,
  roleOptions
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by name or email"
        className="border px-3 py-2 rounded w-full md:w-1/3"
      />
      <select value={role} onChange={(e) => setRole(e.target.value)} className="border px-3 py-2 rounded">
        <option value="">All roles</option>
        {roleOptions.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2">
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border px-3 py-2 rounded">
          <option value="id">ID</option>
          <option value="name">Name</option>
          <option value="email">Email</option>
          <option value="role">Role</option>
        </select>
        <button onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))} className="px-3 py-2 border rounded">
          {sortDir === "asc" ? "Asc" : "Desc"}
        </button>
      </div>
    </div>
  );
}
