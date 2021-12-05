import { makeAutoObservable } from "mobx";
import { NetworkStatus } from "../domain/Customer";
import IWorkoutPlanRepo from "../infra/IWorkoutRepo";
import { RootStore } from "./RootStore";
import _ from 'lodash';
import moment from "moment";

export class WorkoutStore {
  _workoutPlanRepo : IWorkoutPlanRepo;
  _rootStore: RootStore;
  plans: any[] | [] = [];
  workouts: any[] | [] = [];
  network_status = NetworkStatus.Loading;
  workout_status = NetworkStatus.Loading;
  plan_status = NetworkStatus.Loading;
  upload_status = NetworkStatus.NotInitiated;

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
    console.log(workouts);
  }

  async saveWorkout(workout: any) {
    try {
      if(workout) {
        this.workout_status = NetworkStatus.Updating;
        const id = await this._workoutPlanRepo.saveWorkout(workout);
        const workout_copy : any = _.cloneDeep(workout);
        
        if(!workout.id) { // this is not an update not new exercise
          this.workouts = [...this.workouts, {
            ...workout_copy,
            id,
            date: moment().unix(),
            added_by: 'System'
          }];
        } else {
          const copy = _.cloneDeep(this.workouts);
          const i = copy.findIndex((copy) => copy.id === workout.id);
          copy[i].excercise = workout.excercise;
          this.workouts = copy;
        }
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

  async uploadExerciseImage(image: any, exercise_id: string) {
    try {
      this.upload_status = NetworkStatus.Updating;

      const image_url = await this._workoutPlanRepo.uploadImage(image, exercise_id);
      const i = this.workouts.findIndex(workout => workout.id === exercise_id);
      const workouts_cp = _.cloneDeep(this.workouts);
      workouts_cp[i].image = `${image_url}?time=${moment().unix()}`;

      this.workouts = workouts_cp;

      this.upload_status = NetworkStatus.Updated;
    } catch (error) {
      this.upload_status = NetworkStatus.UpdateFailed;
    }
  }
}