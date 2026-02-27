import { prisma } from "../../../prisma/client.js";



export class DashboardService {
    static async getSummary() {
        const totalEmployees = await prisma.employee.count({ where: { deletedAt: null } });

        // Simplistic metric mapping for MVP
        const activeEmployees = await prisma.employee.count({ where: { status: "ACTIVE", deletedAt: null } });
        const pendingLeaves = await prisma.leaveRequest.count({ where: { status: "PENDING" } });

        // Fetch this month's payroll summary (optional)
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const payrollThisMonth = await prisma.payroll.aggregate({
            where: {
                month: currentMonth,
                year: currentYear,
                status: "PROCESSED"
            },
            _sum: { netPay: true }
        });

        return {
            totalEmployees,
            activeEmployees,
            pendingLeaves,
            payrollProcessedThisMonth: payrollThisMonth._sum.netPay || 0
        };
    }
}
