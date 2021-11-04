import { CustomerRepo } from "../infra/CustomerRepo";
import { WorkoutRepo } from "../infra/WorkoutRepo";
import { AppStore } from "./AppStore";
import { CustomerStore } from "./CustomerStore";
import { WorkoutStore } from "./WorkoutStore";

export class RootStore {
  customerStore: CustomerStore;
  appStore: AppStore;
  workoutStore: WorkoutStore;

  constructor(){
    const customerRepo = new CustomerRepo();

    this.customerStore = new CustomerStore(customerRepo, this);
    this.appStore = new AppStore();
    this.workoutStore = new WorkoutStore(new WorkoutRepo(), this);
  }
}