import { sequelize } from "../db"; // <-- import ตัวเดียวกันทุกที่
import userModel from "./user";
import taskModel from "./task";

export const User = userModel(sequelize);
export const Task = taskModel(sequelize);
// ถ้ามี associate, ใส่ตรงนี้
(Task as any).associate?.({ users: User });
