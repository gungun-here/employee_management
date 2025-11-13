

const BASE = "https://jsonplaceholder.typicode.com/users";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

export async function fetchEmployeesApi() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Failed to fetch employees");
  const data = await res.json();
  return data.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: "Developer" 
  }));
}

export async function addEmployeeApi(employee) {
  await wait(500);
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee)
  });
  if (!res.ok) throw new Error("Failed to add employee");
  const data = await res.json();
  return { ...employee, id: data.id || Date.now() };
}

export async function updateEmployeeApi(employee) {
  await wait(400);
  const res = await fetch(`${BASE}/${employee.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee)
  });
  if (!res.ok) throw new Error("Failed to update employee");
  return employee;
}

export async function deleteEmployeeApi(id) {
  await wait(300);
  const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete employee");
  return id;
}
