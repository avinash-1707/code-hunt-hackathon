import type { Request, Response } from "express";
import { asyncHandler } from "../../core/async-handler.js";
import { AdminService } from "./admin.service.js";
import type { CreateUserInput, UpdateUserInput, UserQueryInput } from "./admin.validators.js";

const adminService = new AdminService();

export class AdminController {
  createUser = asyncHandler(async (req: Request, res: Response) => {
    const data: CreateUserInput = req.body;
    const user = await adminService.createUser(data);
    
    res.status(201).json({
      success: true,
      data: user,
      message: "User created successfully"
    });
  });

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const query: UserQueryInput = req.query as any;
    const result = await adminService.getUsers(query);
    
    res.json({
      success: true,
      data: result.users,
      pagination: result.pagination
    });
  });

  getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await adminService.getUserById(id);
    
    res.json({
      success: true,
      data: user
    });
  });

  updateUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const data: UpdateUserInput = req.body;
    const user = await adminService.updateUser(id, data);
    
    res.json({
      success: true,
      data: user,
      message: "User updated successfully"
    });
  });

  deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await adminService.deleteUser(id);
    
    res.json({
      success: true,
      ...result
    });
  });

  getSystemStats = asyncHandler(async (req: Request, res: Response) => {
    const stats = await adminService.getSystemStats();
    
    res.json({
      success: true,
      data: stats
    });
  });
}
