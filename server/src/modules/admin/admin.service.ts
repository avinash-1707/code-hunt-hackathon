import { prisma } from "../../prisma/client.js";
import { hashPassword } from "../../utils/password.js";
import type { CreateUserInput, UpdateUserInput, UserQueryInput } from "./admin.validators.js";

export class AdminService {
  async createUser(data: CreateUserInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const passwordHash = await hashPassword(data.password);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        role: data.role,
        emailVerified: true // Admin can create verified users
      },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return user;
  }

  async getUsers(query: UserQueryInput) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.role) {
      where.role = query.role;
    }

    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          refreshTokens: {
            select: { createdAt: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.user.count({ where })
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        refreshTokens: {
          select: { createdAt: true, userAgent: true }
        }
      }
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateUser(id: string, data: UpdateUserInput) {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error("User not found");
    }

    const updateData: any = {};

    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (existingUser && existingUser.id !== id) {
        throw new Error("Email already in use");
      }
      updateData.email = data.email;
    }

    if (data.role) {
      updateData.role = data.role;
    }

    if (data.emailVerified !== undefined) {
      updateData.emailVerified = data.emailVerified;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return updatedUser;
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.refreshToken.deleteMany({
      where: { userId: id }
    });

    await prisma.user.delete({
      where: { id }
    });

    return { message: "User deleted successfully" };
  }

  async getSystemStats() {
    const [
      totalUsers,
      superAdminCount,
      hrAdminCount,
      hrManagerCount,
      verifiedUsers,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'SUPER_ADMIN' } }),
      prisma.user.count({ where: { role: 'HR_ADMIN' } }),
      prisma.user.count({ where: { role: 'HR_MANAGER' } }),
      prisma.user.count({ where: { emailVerified: true } }),
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      })
    ]);

    return {
      totalUsers,
      roleDistribution: {
        superAdmin: superAdminCount,
        hrAdmin: hrAdminCount,
        hrManager: hrManagerCount
      },
      verifiedUsers,
      recentUsers
    };
  }
}
