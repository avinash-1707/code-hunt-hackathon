import { prisma, LeaveStatus } from "../../../prisma/client.js";
import { AppError } from "../../core/errors.js";
import { AuditService } from "../audit/audit.service.js";
import { AuditAction } from "../audit/audit.types.js";



export class LeavesService {
    static async listLeaves(params: any) {
        const { page, pageSize, status, employeeId } = params;

        const where = {
            ...(status && { status }),
            ...(employeeId && { employeeId }),
        };

        const total = await prisma.leaveRequest.count({ where });
        const leaves = await prisma.leaveRequest.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: 'desc' },
            include: { employee: true },
        });

        return { leaves, total };
    }

    static async updateStatus(id: string, status: string, actorId: string) {
        return await prisma.$transaction(async (tx) => {
            const leave = await tx.leaveRequest.findUnique({ where: { id } });
            if (!leave) throw new AppError(404, "Leave Request not found");
            if (leave.status !== "PENDING") throw new AppError(409, "Can only update PENDING leaves");

            const oldValue = { status: leave.status };
            const newValue = { status };

            const updated = await tx.leaveRequest.update({
                where: { id },
                data: {
                    status: status as LeaveStatus,
                    reviewedBy: actorId,
                    reviewedAt: new Date(),
                },
            });

            await AuditService.logAction(
                {
                    action: status === "APPROVED" ? AuditAction.LEAVE_APPROVED : AuditAction.LEAVE_REJECTED,
                    entityType: "LeaveRequest",
                    entityId: id,
                    actorId,
                    oldValue,
                    newValue,
                },
                tx
            );

            return updated;
        }, { isolationLevel: "ReadCommitted" });
    }
}
