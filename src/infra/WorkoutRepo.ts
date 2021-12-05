import { WorkoutPlan } from "../domain/Workout";
import IWorkoutPlanRepo from "./IWorkoutRepo";
import axios from "axios";
import httpStatus from "http-status";

export class WorkoutRepo implements IWorkoutPlanRepo {

  API_HOST : string = 'https://api.mnbfitness.ca/';

  constructor() {
    const { REACT_APP_API_HOST } = process.env;

    console.log(REACT_APP_API_HOST);
    if (REACT_APP_API_HOST) {
      this.API_HOST = REACT_APP_API_HOST;
    }
  }

  async getAllPlans() : Promise<WorkoutPlan[] |[]> {
    try {
      const res = await axios.get(`${this.API_HOST}api/v1/admin/workout-plans/`, {
        withCredentials: true,
        headers: {
         'Access-Control-Allow-Credentials': "true",
         'Access-Control-Allow-Origin' : '*',
       },
     });

     const workout_plans = res.data as WorkoutPlan[] | [];
     console.log(workout_plans)
     return workout_plans;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async saveWorkout(workout: any) : Promise<string> {
    try {
      const response = await axios.post(`${this.API_HOST}api/v1/admin/workout/`, {
        ...workout,
        withCredentials: true,
        headers: {
         'Access-Control-Allow-Credentials': "true",
         'Access-Control-Allow-Origin' : '*',
       },
     });

     if(response.status === httpStatus.OK) {
      return response.data.status;
    } else {
      throw new Error('Failed to save the workout');
    }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to save the workout');
    }
  }

  async saveWorkoutPlan(plan: any) : Promise<boolean> {
    try {
      console.log(plan);
      const response = await axios.post(`${this.API_HOST}api/v1/admin/workout-plans/`, {
        ...plan,
        withCredentials: true,
        headers: {
         'Access-Control-Allow-Credentials': "true",
         'Access-Control-Allow-Origin' : '*',
       },
     });

     if(response.status === httpStatus.OK) {
      return true;
    } else {
      return false;
    }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async getWorkouts() : Promise<any[] | []> {
    try {
      const res = await axios.get(`${this.API_HOST}api/v1/admin/workouts/`, {
        withCredentials: true,
        headers: {
         'Access-Control-Allow-Credentials': "true",
         'Access-Control-Allow-Origin' : '*',
       },
     });

     const workouts = res.data ;
     console.log(workouts);
     return workouts;
    } catch (error) {
      console.error(error);
      return []
    }
  }

  async uploadImage(base64_image: string, exercise_id: string) : Promise<string> {
    const promise = new Promise<string>(async (resolve, reject) => {
      try {
        const res : any = await axios.post(`${this.API_HOST}api/v1/admin/exercises/${exercise_id}/`, {
          base64_image,
          withCredentials: true,
          headers: {
           'Access-Control-Allow-Credentials': "true",
           'Access-Control-Allow-Origin' : '*',
         },
       });
  
       if(res.status === httpStatus.OK) {
         resolve(res.data.image_url)
       }
      } catch (error) {
        reject(error);
      }
    });
    
    return promise;
  }
}