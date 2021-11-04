import { CustomerRepo } from "../infra/CustomerRepo";
import { DietRepo } from "../infra/DietRepo";
import { WorkoutRepo } from "../infra/WorkoutRepo";
import { AppStore } from "./AppStore";
import { CustomerStore } from "./CustomerStore";
import { DietStore } from "./DietStore";
import { WorkoutStore } from "./WorkoutStore";

export class RootStore {
  customerStore: CustomerStore;
  appStore: AppStore;
  workoutStore: WorkoutStore;
  dietStore: DietStore;

  constructor(){
    const customerRepo = new CustomerRepo();

    this.customerStore = new CustomerStore(customerRepo, this);
    this.appStore = new AppStore();
    this.workoutStore = new WorkoutStore(new WorkoutRepo(), this);
    this.dietStore = new DietStore(new DietRepo(), this);
  }
}