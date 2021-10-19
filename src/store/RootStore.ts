import { CustomerRepo } from "../infra/CustomerRepo";
import { CustomerStore } from "./CustomerStore";

export class RootStore {
  customerStore: CustomerStore;

  constructor(){
    const customerRepo = new CustomerRepo();

    this.customerStore = new CustomerStore(customerRepo, this);
  }
}