import { prisma } from "../../../prisma/client.js";
import { AuditService } from "../audit/audit.service.js";
import { AuditAction } from "../audit/audit.types.js";



export class PerformanceService {
    static async listReviews(employeeId: string, params: any) {
        const { page, pageSize } = params;

        const where = { employeeId };

        const total = await prisma.performanceReview.count({ where });
        const reviews = await prisma.performanceReview.findMany({
            where,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: { createdAt: "desc" },
            include: {
                reviewer: {
                    select: { id: true, firstName: true, lastName: true },
                },
            },
        });

        return { reviews, total };
    }

    static async createReview(employeeId: string, data: any, reviewerUserId: string) {
        return await prisma.$transaction(async (tx) => {
            // Find the employee ID of the reviewer based on their user ID
            const reviewer = await tx.employee.findUnique({
                where: { userId: reviewerUserId },
            });

            // If the HR Admin doesn't have an Employee record, we could either error or use a system ID.
            // But based on the PRD, reviewer is "auto-set to current user" which means we link to the Employee record of the HR admin.
            // Assuming HR Admin has an employee record. If not, this might fail, but let's stick to the schema.
            if (!reviewer) {
                throw new Error("Reviewer Employee record not found for the current user.");
            }

            const review = await tx.performanceReview.create({
                data: {
                    employeeId,
                    reviewerId: reviewer.id,
                    reviewPeriod: data.reviewPeriod,
                    rating: data.rating,
                    comments: data.comments,
                }
            });

            await AuditService.logAction({
                action: AuditAction.REVIEW_CREATED,
                entityType: "PerformanceReview",
                entityId: review.id,
                actorId: reviewerUserId,
                newValue: review,
            }, tx);

            return review;
        });
    }
}
