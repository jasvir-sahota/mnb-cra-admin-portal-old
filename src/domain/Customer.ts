import { makeAutoObservable } from "mobx";
import { DietSchedule } from "./DietSchedule";
import { TrainingSchedule } from "./TrainingSchedule";
import { Profile } from "./Profile";

enum NetworkStatus {
  NotInitiated,
  Loading,
  Loaded,
  LoadingFailed,
  Updating,
  UpdateFailed,
  Updated
}

class Customer {
  id: number;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  email: string;
  training_schedules: TrainingSchedule[] | [];
  diet_schedules: DietSchedule[] | [];
  profile?: Profile;
  primary_phone: string;
  gender: string;

  constructor(json: string) {
    makeAutoObservable(this, {
      id: false,
      first_name: false,
      last_name: false,
      date_of_birth: false,
      email: false,
      gender: false,
      primary_phone: false
    });

    const obj = JSON.parse(json);
    const {
      id,
      first_name,
      last_name,
      date_of_birth,
      email,
      training_schedules,
      diet_schedules,
      gender,
      primary_phone,
    } = obj;
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.date_of_birth = date_of_birth;
    this.email = email;
    this.training_schedules =training_schedules;
    this.diet_schedules = diet_schedules;
    this.gender = gender
    this.primary_phone = primary_phone
  }
}

export default Customer;

export {
  NetworkStatus
}