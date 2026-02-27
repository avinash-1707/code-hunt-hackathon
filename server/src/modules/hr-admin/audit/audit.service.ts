import { prisma } from "../../../prisma/client.js";
import { AuditAction } from "./audit.types.js";



export class AuditService {
    static async logAction(
        params: {
            action: AuditAction;
            entityType: string;
            entityId: string;
            actorId: string;
            oldValue?: object;
            newValue?: object;
            metadata?: object;
        },
        tx: any = prisma
    ) {
        return await tx.auditLog.create({
            data: {
                action: params.action,
                entityType: params.entityType,
                entityId: params.entityId,
                actorId: params.actorId,
                oldValue: params.oldValue ? JSON.parse(JSON.stringify(params.oldValue)) : null,
                newValue: params.newValue ? JSON.parse(JSON.stringify(params.newValue)) : null,
                metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : null,
            },
        });
    }
}
