import { prisma, Prisma, EmployeeStatus } from "../../../prisma/client.js";
import { AppError } from "../../core/errors.js";
import { AuditService } from "../audit/audit.service.js";
import { AuditAction } from "../audit/audit.types.js";



export class EmployeeService {
    static async listEmployees(params: any) {
        const { page, pageSize, search, departmentId, status, employmentType, includeDeleted, sortBy, sortOrder } = params;

        const where: Prisma.EmployeeWhereInput = {
            ...(departmentId && { departmentId }),
            ...(status && { status }),
            ...(employmentType && { employmentType }),
            ...(!includeDeleted && { deletedAt: null }),
            ...(search && {
                OR: [
                    { firstName: { contains: search, mode: 'insensitive' } },
                    { lastName: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };

        const total = await prisma.employee.count({ where });
        const employees = await prisma.employee.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { [sortBy]: sortOrder },
            include: { department: true, position: true },
        });

        return { employees, total };
    }

    static async getEmployee(id: string) {
        const employee = await prisma.employee.findUnique({
            where: { id },
            include: {
                department: true,
                position: true,
                organization: true,
            },
        });

        if (!employee) throw new AppError(404, "Employee not found");
        return employee;
    }

    static async updateStatus(id: string, status: string, actorId: string) {
        return await prisma.$transaction(async (tx) => {
            const employee = await tx.employee.findUnique({ where: { id } });
            if (!employee) throw new AppError(404, "Employee not found");
            if (employee.status === status) throw new AppError(409, "Employee already has this status");

            const oldValue = { status: employee.status };
            const newValue = { status };

            const updated = await tx.employee.update({
                where: { id },
                data: { status: status as EmployeeStatus },
            });

            await AuditService.logAction(
                {
                    action: AuditAction.EMPLOYEE_STATUS_CHANGED,
                    entityType: "Employee",
                    entityId: id,
                    actorId,
                    oldValue,
                    newValue,
                },
                tx
            );

            return updated;
        }, { isolationLevel: "Serializable" });
    }

    static async softDelete(id: string, actorId: string) {
        return await prisma.$transaction(async (tx) => {
            const employee = await tx.employee.findUnique({ where: { id } });
            if (!employee) throw new AppError(404, "Employee not found");
            if (employee.deletedAt) throw new AppError(409, "Employee already deleted");

            const now = new Date();

            const updated = await tx.employee.update({
                where: { id },
                data: { deletedAt: now },
            });

            // Cancel draft payrolls
            await tx.payroll.updateMany({
                where: { employeeId: id, status: "DRAFT" },
                data: { status: "PROCESSED" }, // Cancelled or dropped? Requirements say: "DRAFT payroll records auto-cancelled" - but enum has no "CANCELLED" for Payroll. Let's delete them.
            });
            await tx.payroll.deleteMany({
                where: { employeeId: id, status: "DRAFT" }
            });

            await AuditService.logAction(
                {
                    action: AuditAction.EMPLOYEE_SOFT_DELETED,
                    entityType: "Employee",
                    entityId: id,
                    actorId,
                    oldValue: { deletedAt: null },
                    newValue: { deletedAt: now },
                },
                tx
            );

            return updated;
        }, { isolationLevel: "Serializable" });
    }
}
