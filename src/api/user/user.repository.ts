import type { User } from "@/api/user/user.model";
import users from "@/api/user/user.schema";
import { Op } from "sequelize";

export class UserRepository {
  async findAllAsync(search?: string): Promise<User[] | null> {
    const options: any = { attributes: { exclude: ["password"] } };

    // If a search query is provided, add a where clause
    if (search) {
      options.where = {
        name: {
          [Op.like]: `%${search}%`
        }
      };
    }

    return (await users.findAll(options)) || null;
  }
  async findByIdAsync(id: number): Promise<User | null> {
    return (await users.findOne({ where: { id }, attributes: { exclude: ["password"] } })) || null;
  }
  async findUserWithPasswordById(id: number): Promise<User | null> {
    return (
      await users.findOne({
        where: { id },
        attributes: { include: ["password"] }
      })
    ) || null;
  }
  async findByEmailAsync(email: string): Promise<User | null> {
    return (await users.findOne({ where: { email } })) || null;
  }
  async findByPhoneAsync(phone: number): Promise<User | null> {
    return (await users.findOne({ where: { phone } })) || null;
  }
  async create(user: any): Promise<User | null> {
    return (await users.create(user)) || null;
  }
  async saveResetToken(userId: number, token: string): Promise<void> {
    let use = await users.update(
      { resetToken: token },
      { where: { id: userId } }
    );
  }

  async updatePassword(userId: number, newPassword: string): Promise<void> {
    await users.update({ password: newPassword }, { where: { id: userId } });
  }
  async clearResetToken(userId: number): Promise<void> {
    await users.update(
      { resetToken: null, resetTokenExpiry: null },
      { where: { id: userId } }
    );
  }
  async findByResetTokenAsync(resetToken: string): Promise<User | null> {
    return await users.findOne({ where: { resetToken } });
  }
  async getUserTOTPSecret(email: string): Promise<string | null> {
    const user: any = await users.findOne({ where: { email } });
    return user ? user.totpSecret : null; // Assume 'totpSecret' is the field where you store the TOTP secret
  }
}
