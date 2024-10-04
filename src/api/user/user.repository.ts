import type { User } from "@/api/user/user.model";
import users from "@/api/user/user.schema";

export class UserRepository {
  async findAllAsync(): Promise<User[] | null> {
    return (await users.findAll({ attributes: { exclude: ["password"] } })) || null;
  }

  async findByIdAsync(id: number): Promise<User | null> {
    return (await users.findOne({ where: { id }, attributes: { exclude: ["password"] } })) || null;
  }

  async findByEmailAsync(email: string): Promise<User | null> {
    return (await users.findOne({ where: { email } })) || null;
  }

  async create(user: any): Promise<User | null> {
    return (await users.create(user)) || null;
  }
}
