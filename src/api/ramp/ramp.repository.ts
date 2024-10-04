import type { ramp } from "@/api/ramp/ramp.model";
import Ramp from "@/api/ramp/ramp.schema";

export class RampRepository {
  async findAllAsync(): Promise<ramp[] | null> {
    return (await Ramp.findAll()) || null;
  }
  async findAllByType(type: string): Promise<ramp[] | null> {
    return (await Ramp.findAll({ where: { type } })) || null;
  }
}
