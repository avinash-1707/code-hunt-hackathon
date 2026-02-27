import { prisma } from "../../../prisma/client.js";
import { AppError } from "../../../core/errors.js";
import { AuditService } from "../audit/audit.service.js";
import { AuditAction } from "../audit/audit.types.js";

export class PayrollService {
  static async listPayroll(employeeId: string, params: any) {
    const { page, pageSize } = params;
    const where = { employeeId };

    const total = await prisma.payroll.count({ where });
    const payrolls = await prisma.payroll.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: [{ year: "desc" }, { month: "desc" }],
    });

    return { payrolls, total };
  }

  static async createDraft(employeeId: string, data: any) {
    // We don't audit DRAFT creation strictly based on PRD enum AuditAction.PAYROLL_PROCESSED is only for processing
    // But it's good practice. PRD 3.7 doesn't mention audit for create, only for process.
    return await prisma.payroll.create({
      data: {
        ...data,
        employeeId,
        status: "DRAFT",
      },
    });
  }

  static async processPayroll(id: string, actorId: string) {
    return await prisma.$transaction(
      async (tx) => {
        const payroll = await tx.payroll.findUnique({ where: { id } });
        if (!payroll) throw new AppError(404, "Payroll not found");
        if (payroll.status === "PROCESSED")
          throw new AppError(409, "Payroll already processed");

        const oldValue = { status: payroll.status };
        const newValue = { status: "PROCESSED" };

        const updated = await tx.payroll.update({
          where: { id },
          data: {
            status: "PROCESSED",
            processedBy: actorId,
            processedAt: new Date(),
          },
        });

        await AuditService.logAction(
          {
            action: AuditAction.PAYROLL_PROCESSED,
            entityType: "Payroll",
            entityId: id,
            actorId,
            oldValue,
            newValue,
          },
          tx,
        );

        return updated;
      },
      { isolationLevel: "Serializable" },
    );
  }

  static async getSummary() {
    // Org-wide simplified summary for all processed payroll
    const result = await prisma.payroll.groupBy({
      by: ["year", "month"],
      _sum: {
        grossPay: true,
        totalDeductions: true,
        netPay: true,
      },
      where: {
        status: "PROCESSED",
      },
    });

    return result;
  }
}
