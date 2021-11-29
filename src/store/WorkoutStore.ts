import { makeAutoObservable } from "mobx";
import { NetworkStatus } from "../domain/Customer";
import { WorkoutPlan } from "../domain/Workout";
import IWorkoutPlanRepo from "../infra/IWorkoutRepo";
import { RootStore } from "./RootStore";
import _ from 'lodash';

export class WorkoutStore {
  _workoutPlanRepo : IWorkoutPlanRepo;
  _rootStore: RootStore;
  plans: any[] | [] = [];
  workouts: any[] | [] = [];
  network_status = NetworkStatus.Loading;
  workout_status = NetworkStatus.Loading;
  plan_status = NetworkStatus.Loading;

  constructor(workoutplanRepo: IWorkoutPlanRepo, rootStore: RootStore) {
    makeAutoObservable(this, {_rootStore: false, _workoutPlanRepo: false});
    this._rootStore = rootStore;
    this._workoutPlanRepo = workoutplanRepo;
    this.fetchWorkouts();
    this.fetchPlans();
  }

  async fetchPlans() {
    const plans = await this._workoutPlanRepo.getAllPlans();
    this.plans = plans;
    this.plan_status = NetworkStatus.Loaded;
  }

  async fetchWorkouts() {
    const workouts = await this._workoutPlanRepo.getWorkouts();
    this.workouts = workouts;
    this.workout_status = NetworkStatus.Loaded;
  }

  async saveWorkout(workout: any) {
    try {
      if(workout) {
        this.workout_status = NetworkStatus.Updating;
        await this._workoutPlanRepo.saveWorkout(workout);
        const workout_copy : any = _.cloneDeep(workout);
        this.workouts = [...this.workouts, workout_copy];
        this.workout_status = NetworkStatus.Updated;
      }
    } catch (error) {
      console.log(error);
      this.workout_status = NetworkStatus.UpdateFailed;
    }
  }

  async savePlan(plan: any) {
    this.plan_status = NetworkStatus.Updating;
    const status = await this._workoutPlanRepo.saveWorkoutPlan(plan);
    console.log(status);
    if (status) {
      this.plan_status = NetworkStatus.Updated;
      
      // Refresh plans
      const plans = await this._workoutPlanRepo.getAllPlans();
      this.plans = plans;
    } else {
      this.plan_status = NetworkStatus.UpdateFailed;
    }
  }
}