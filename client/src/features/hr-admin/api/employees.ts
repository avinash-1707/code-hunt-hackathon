import { api } from "../../../lib/api";

export const HR_ADMIN_API_URL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/hr-admin`
    : "http://localhost:4000/api/v1/hr-admin";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

const MOCK_EMPLOYEES = [
    {
        id: "emp-1",
        firstName: "Sanya",
        lastName: "Sharma",
        photo: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
        email: "sanya.sharma@company.com",
        phone: "+91 98765 43210",
        department: { name: "Engineering" },
        position: { title: "Senior Developer" },
        status: "ACTIVE",
        joiningDate: "2023-01-15T00:00:00.000Z",
        employmentType: "Full-Time",
        location: "Bengaluru, India",
        manager: "Kunal Desai",
        performanceHistory: [
            { month: 'Jan', score: 4.2 },
            { month: 'Feb', score: 4.5 },
            { month: 'Mar', score: 4.3 },
            { month: 'Apr', score: 4.6 },
            { month: 'May', score: 4.8 },
            { month: 'Jun', score: 4.9 },
        ],
        attendanceRate: 98,
        goals: [
            { id: 1, title: 'Ship v2.0 Authentication', progress: 100, status: 'Completed' },
            { id: 2, title: 'Reduce API Latency by 20%', progress: 75, status: 'In Progress' },
            { id: 3, title: 'Mentor Junior Developers', progress: 40, status: 'In Progress' },
        ],
        compensation: {
            salary: "₹24,00,000",
            bonus: "15%",
            stockOptions: "2,000 shares",
            nextReview: "2024-01-15"
        }
    },
    {
        id: "emp-2",
        firstName: "Sia",
        lastName: "Rai",
        photo: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
        email: "sia.rai@company.com",
        phone: "+91 98765 43211",
        department: { name: "Marketing" },
        position: { title: "Marketing Manager" },
        status: "ACTIVE",
        joiningDate: "2022-06-01T00:00:00.000Z",
        employmentType: "Full-Time",
        location: "Mumbai, India",
        manager: "Ria Kapoor",
        performanceHistory: [
            { month: 'Jan', score: 4.0 },
            { month: 'Feb', score: 4.1 },
            { month: 'Mar', score: 4.0 },
            { month: 'Apr', score: 4.3 },
            { month: 'May', score: 4.4 },
            { month: 'Jun', score: 4.5 },
        ],
        attendanceRate: 95,
        goals: [
            { id: 1, title: 'Q3 Marketing Campaign Launch', progress: 90, status: 'In Progress' },
            { id: 2, title: 'Increase Social Engagement', progress: 60, status: 'In Progress' },
        ],
        compensation: {
            salary: "₹18,00,000",
            bonus: "10%",
            stockOptions: "1,000 shares",
            nextReview: "2023-12-01"
        }
    },
    {
        id: "emp-3",
        firstName: "Sahil",
        lastName: "Shrinivas",
        photo: "https://i.pravatar.cc/150?u=a04258114e29026702d",
        email: "sahil.s@company.com",
        phone: "+91 98765 43212",
        department: { name: "Sales" },
        position: { title: "Sales Representative" },
        status: "ON_LEAVE",
        joiningDate: "2024-03-10T00:00:00.000Z",
        employmentType: "Full-Time",
        location: "Delhi, India",
        manager: "Arjun Verma",
        performanceHistory: [
            { month: 'Jan', score: 3.5 },
            { month: 'Feb', score: 3.8 },
            { month: 'Mar', score: 3.9 },
            { month: 'Apr', score: 4.0 },
            { month: 'May', score: null },
            { month: 'Jun', score: null },
        ],
        attendanceRate: 88,
        goals: [
            { id: 1, title: 'Close 5 Enterprise Deals', progress: 20, status: 'At Risk' },
        ],
        compensation: {
            salary: "₹12,00,000",
            bonus: "Commission-based",
            stockOptions: "None",
            nextReview: "2024-03-10"
        }
    }
];

export const fetchEmployees = async (params?: { search?: string, status?: string, department?: string }) => {
    if (!USE_MOCK_DATA) {
        const response = await api.get(`${HR_ADMIN_API_URL}/employees`, { params });
        return response.data;
    }

    let filteredEmployees = MOCK_EMPLOYEES;

    if (params?.search) {
        const query = params.search.toLowerCase();
        filteredEmployees = filteredEmployees.filter(emp =>
            emp.firstName.toLowerCase().includes(query) ||
            emp.lastName.toLowerCase().includes(query) ||
            emp.email.toLowerCase().includes(query) ||
            emp.department.name.toLowerCase().includes(query) ||
            emp.position.title.toLowerCase().includes(query)
        );
    }

    if (params?.status && params.status !== "ALL") {
        filteredEmployees = filteredEmployees.filter(emp => emp.status === params.status);
    }

    if (params?.department && params.department !== "ALL") {
        filteredEmployees = filteredEmployees.filter(emp => emp.department.name === params.department);
    }
    return {
        data: filteredEmployees,
        meta: { total: filteredEmployees.length, page: 1, limit: 10 }
    };
};

export async function fetchEmployeeProfile(id: string) {
    if (!USE_MOCK_DATA) {
        const response = await api.get(`${HR_ADMIN_API_URL}/employees/${id}`);
        return response.data;
    }
    // Return mock data instead of calling API
    const employee = MOCK_EMPLOYEES.find(e => e.id === id) || MOCK_EMPLOYEES[0];
    return { data: { employee } };
}

export async function updateEmployeeStatus(id: string, status: string) {
    const res = await fetch(`${HR_ADMIN_API_URL}/employees/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update status");
    return res.json();
}
