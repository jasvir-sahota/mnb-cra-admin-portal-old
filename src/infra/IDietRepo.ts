import { DietPlan } from "../domain/Diet";

interface IDietPlanRepo {
  getAllPlans() : Promise<DietPlan[] | []>
  getDiets() : Promise<any[] | []>
  saveDiet(Diet: any) : Promise<string>
  saveDietPlan(plan: any) : Promise<boolean>
}

export default IDietPlanRepo;