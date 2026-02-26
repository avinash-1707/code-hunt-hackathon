import { api } from "../../../lib/api";

export const HR_ADMIN_API_URL = process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/hr-admin`
    : "http://localhost:4000/api/v1/hr-admin";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA !== 'false';

export async function fetchDashboardSummary() {
    if (!USE_MOCK_DATA) {
        const response = await api.get(`${HR_ADMIN_API_URL}/dashboard/summary`);
        return response.data;
    }
    // Return mock data instead of calling API
    return {
        data: {
            totalEmployees: 142,
            activeEmployees: 138,
            pendingLeaves: 8,
            payrollProcessedThisMonth: 854000,
            departmentBreakdown: [
                { name: 'Engineering', value: 45 },
                { name: 'Sales', value: 35 },
                { name: 'Marketing', value: 25 },
                { name: 'HR', value: 12 },
                { name: 'Finance', value: 25 },
            ],
            hiringTrends: [
                { month: 'Jan', hires: 4 },
                { month: 'Feb', hires: 7 },
                { month: 'Mar', hires: 5 },
                { month: 'Apr', hires: 10 },
                { month: 'May', hires: 8 },
                { month: 'Jun', hires: 12 },
            ],
            recentActivities: [
                { id: 1, type: 'onboarding', text: 'Sarah Jenkins joined Engineering', time: '2 hours ago' },
                { id: 2, type: 'leave', text: 'Mike Ross submitted a leave request', time: '4 hours ago' },
                { id: 3, type: 'payroll', text: 'May payroll draft generated', time: '1 day ago' },
                { id: 4, type: 'status', text: 'David Chen promoted to Senior Dev', time: '2 days ago' },
            ]
        }
    };
}
