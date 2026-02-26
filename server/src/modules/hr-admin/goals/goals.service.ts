import { prisma, GoalType, GoalStatus } from "../../../prisma/client.js";
import { AppError } from "../../core/errors.js";
import { AuditService } from "../audit/audit.service.js";
import { AuditAction } from "../audit/audit.types.js";



export class GoalsService {
    static async listGoals(employeeId: string, params: any) {
        const { page, pageSize, type, status } = params;

        const where = {
            employeeId,
            ...(type && { type }),
            ...(status && { status }),
        };

        const total = await prisma.goal.count({ where });
        const goals = await prisma.goal.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { dueDate: "asc" },
        });

        return { goals, total };
    }

    static async getSummary(employeeId: string) {
        const goals = await prisma.goal.findMany({ where: { employeeId } });

        const calculateRate = (type: string) => {
            const typeGoals = goals.filter(g => g.type === type);
            const completed = typeGoals.filter(g => g.status === "COMPLETED").length;
            return typeGoals.length ? Math.round((completed / typeGoals.length) * 100) : 0;
        };

        return {
            total: goals.length,
            completed: goals.filter(g => g.status === "COMPLETED").length,
            weeklyRate: calculateRate("WEEKLY"),
            monthlyRate: calculateRate("MONTHLY"),
        };
    }

    static async createGoal(employeeId: string, data: any, actorId: string) {
        return await prisma.$transaction(async (tx) => {
            const goal = await tx.goal.create({
                data: {
                    employeeId,
                    title: data.title,
                    description: data.description,
                    type: data.type as GoalType,
                    dueDate: new Date(data.dueDate),
                    status: data.status as GoalStatus,
                }
            });

            await AuditService.logAction({
                action: AuditAction.GOAL_CREATED,
                entityType: "Goal",
                entityId: goal.id,
                actorId,
                newValue: goal,
            }, tx);

            return goal;
        });
    }

    static async updateGoal(id: string, data: any, actorId: string) {
        return await prisma.$transaction(async (tx) => {
            const existing = await tx.goal.findUnique({ where: { id } });
            if (!existing) throw new AppError(404, "Goal not found");

            const updateData: any = {};
            if (data.title) updateData.title = data.title;
            if (data.description) updateData.description = data.description;
            if (data.type) updateData.type = data.type as GoalType;
            if (data.dueDate) updateData.dueDate = new Date(data.dueDate);
            if (data.status) updateData.status = data.status as GoalStatus;

            const goal = await tx.goal.update({ where: { id }, data: updateData });

            await AuditService.logAction({
                action: AuditAction.GOAL_UPDATED,
                entityType: "Goal",
                entityId: goal.id,
                actorId,
                oldValue: existing,
                newValue: goal,
            }, tx);

            return goal;
        });
    }
}
