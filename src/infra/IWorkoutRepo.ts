import { WorkoutPlan } from "../domain/Workout";

interface IWorkoutPlanRepo {
  getAllPlans() : Promise<WorkoutPlan[] | []>
  getWorkouts() : Promise<any[] | []>
  saveWorkout(workout: any) : Promise<string>
  saveWorkoutPlan(plan: any) : Promise<boolean>
  uploadImage(base64_image: string, exercise_id: string): Promise<string>;
}

export default IWorkoutPlanRepo;