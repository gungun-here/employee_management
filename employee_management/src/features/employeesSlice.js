import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchEmployeesApi,
  addEmployeeApi,
  updateEmployeeApi,
  deleteEmployeeApi
} from "../api/employeesApi";

export const fetchEmployees = createAsyncThunk("employees/fetch", async () => {
  return await fetchEmployeesApi();
});

export const addEmployee = createAsyncThunk(
  "employees/add",
  async (employee) => {
    return await addEmployeeApi(employee);
  }
);

export const updateEmployee = createAsyncThunk(
  "employees/update",
  async (employee) => {
    return await updateEmployeeApi(employee);
  }
);

export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id) => {
    return await deleteEmployeeApi(id);
  }
);

const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    lastActionSuccess: null
  },
  reducers: {
    clearLastAction(state) {
      state.lastActionSuccess = null;
    }
  },
  extraReducers(builder) {
    builder

      .addCase(fetchEmployees.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(addEmployee.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items.unshift(action.payload);
        state.lastActionSuccess = "Employee added successfully";
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(updateEmployee.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        const idx = state.items.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.lastActionSuccess = "Employee updated successfully";
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(deleteEmployee.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = state.items.filter((e) => e.id !== action.payload);
        state.lastActionSuccess = "Employee deleted successfully";
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export const { clearLastAction } = employeesSlice.actions;
export default employeesSlice.reducer;
