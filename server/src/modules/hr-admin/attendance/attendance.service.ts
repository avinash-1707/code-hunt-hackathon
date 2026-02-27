import { prisma } from "../../../prisma/client.js";
import type { Prisma } from "../../../generated/prisma/client.js";
import { AttendanceStatus } from "../../../generated/prisma/enums.js";
import { AuditService } from "../audit/audit.service.js";
import { AuditAction } from "../audit/audit.types.js";

export class AttendanceService {
  static async listAttendance(employeeId: string, params: any) {
    const { month, year } = params;

    const where: any = { employeeId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const records = await prisma.attendance.findMany({
      where,
      orderBy: { date: "asc" },
    });

    return { records };
  }

  static async upsertAttendance(
    employeeId: string,
    data: any,
    actorId: string,
  ) {
    return await prisma.$transaction(async (tx) => {
      const date = new Date(data.date);
      date.setHours(0, 0, 0, 0); // Normalize to start of day

      const existing = await tx.attendance.findUnique({
        where: {
          employeeId_date: {
            employeeId,
            date,
          },
        },
      });

      const upsertData = {
        employeeId,
        date,
        status: data.status as AttendanceStatus,
        checkIn: data.checkIn ? new Date(data.checkIn) : null,
        checkOut: data.checkOut ? new Date(data.checkOut) : null,
        notes: data.notes || null,
      };

      const record = await tx.attendance.upsert({
        where: {
          employeeId_date: {
            employeeId,
            date,
          },
        },
        update: upsertData,
        create: upsertData,
      });

      await AuditService.logAction(
        {
          action: AuditAction.ATTENDANCE_UPDATED,
          entityType: "Attendance",
          entityId: record.id,
          actorId,
          oldValue: existing || undefined,
          newValue: record,
        },
        tx,
      );

      return record;
    });
  }

  static async getSummary(employeeId: string, month: number, year: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const records = await prisma.attendance.findMany({
      where: {
        employeeId,
        date: { gte: startDate, lte: endDate },
      },
    });

    const workingDays = records.length; // Simplified; actual logic might account for weekends/holidays
    const present = records.filter((r) => r.status === "PRESENT").length;
    const absent = records.filter((r) => r.status === "ABSENT").length;
    const leave = records.filter((r) => r.status === "LEAVE").length;
    const halfDay = records.filter((r) => r.status === "HALF_DAY").length;

    // Compliance = (Present + HalfDay) / WorkingDays
    const compliantCount = present + halfDay;
    const complianceRate =
      workingDays > 0 ? Math.round((compliantCount / workingDays) * 100) : 0;

    return {
      workingDays,
      present,
      absent,
      leave,
      halfDay,
      complianceRate,
    };
  }
}
