import { prisma } from "../../../prisma/client.js";
import { AuditService } from "../audit/audit.service.js";
import { AuditAction } from "../audit/audit.types.js";



export class CompensationService {
    static async listComp(employeeId: string, params: any) {
        const { page, pageSize } = params;

        const where = { employeeId };

        const total = await prisma.compensation.count({ where });
        const compensations = await prisma.compensation.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { effectiveFrom: "desc" },
        });

        return { compensations, total };
    }

    static async createComp(employeeId: string, data: any, actorId: string) {
        return await prisma.$transaction(async (tx) => {
            const comp = await tx.compensation.create({
                data: {
                    employeeId,
                    baseSalary: data.baseSalary,
                    bonus: data.bonus,
                    currency: data.currency,
                    effectiveFrom: new Date(data.effectiveFrom),
                }
            });

            await AuditService.logAction({
                action: AuditAction.COMPENSATION_UPDATED,
                entityType: "Compensation",
                entityId: comp.id,
                actorId,
                newValue: comp,
            }, tx);

            return comp;
        }, { isolationLevel: "ReadCommitted" });
    }
}
