import { api } from "../../../lib/api";

export const HR_ADMIN_API_URL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/hr-admin`
    : "http://localhost:4000/api/v1/hr-admin";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

const MOCK_LEAVES = [
    {
        id: "leave-1",
        employeeId: "emp-1",
        type: "Annual",
        startDate: "2024-12-20T00:00:00.000Z",
        endDate: "2024-12-26T00:00:00.000Z",
        status: "APPROVED",
        reason: "Family vacation"
    },
    {
        id: "leave-2",
        employeeId: "emp-3",
        type: "Sick",
        startDate: "2024-11-05T00:00:00.000Z",
        endDate: "2024-11-08T00:00:00.000Z",
        status: "PENDING",
        reason: "Flu"
    }
];

export async function fetchEmployeeLeaves(employeeId: string, params: any = {}) {
    if (!USE_MOCK_DATA) {
        const response = await api.get(`${HR_ADMIN_API_URL}/employees/${employeeId}/leaves`, { params });
        return response.data;
    }
    // Return mock data instead of calling API
    const leaves = MOCK_LEAVES.filter(l => l.employeeId === employeeId);
    return { data: leaves };
}

export async function updateLeaveStatus(id: string, status: string) {
    const res = await fetch(`${HR_ADMIN_API_URL}/leaves/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update leave status");
    return res.json();
}
