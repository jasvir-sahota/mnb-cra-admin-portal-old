import { WorkoutPlan } from "../domain/Workout";

interface IWorkoutPlanRepo {
  getAllPlans() : Promise<WorkoutPlan[] | []>
  getWorkouts() : Promise<any[] | []>
  saveWorkout(workout: any) : Promise<string>
  saveWorkoutPlan(plan: any) : Promise<boolean>
}

export default IWorkoutPlanRepo;