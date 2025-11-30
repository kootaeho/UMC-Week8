import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export { pool } from "./dbconfig";
