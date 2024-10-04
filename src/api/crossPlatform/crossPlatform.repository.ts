import type { crossPlatform } from "@/api/crossPlatform/crossPlatform.model";
import CrossPlatForm from "@/api/crossPlatform/crossPlatform.schema";

export class CrossPlatformRepository {
  async findAllAsync(): Promise<crossPlatform[] | null> {
    return (await CrossPlatForm.findAll()) || null;
  }
}
