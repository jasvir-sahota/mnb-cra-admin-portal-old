import { makeAutoObservable } from "mobx";
import Customer, { NetworkStatus } from "../domain/Customer";
import ICustomerRepo from "../infra/ICustomerRepo";
import { RootStore } from "./RootStore";

export class CustomerStore {
  network_status = NetworkStatus.Loading;
  customers: Customer[] | [] = [];

  _customerRepo: ICustomerRepo;
  _rootStore: RootStore;
  schedule_status = NetworkStatus.Loaded;

  constructor(customerRepo: ICustomerRepo, rootStore: RootStore){
    makeAutoObservable(this, { _rootStore: false, _customerRepo: false });
    this._customerRepo = customerRepo;
    this._rootStore = rootStore;
    this.network_status = NetworkStatus.Loaded;
    console.log(this.customers);
  }

  async fetchCustomers() {
    const customers = await this._customerRepo.getCustomers();
    this.setCustomers(customers);
  }
  
  setCustomers(customers: Customer[] | []) {
    this.customers = customers;
  }

  async saveSchedule(schedule: string, customer_id: string){
    this.schedule_status = NetworkStatus.Updating;
    const status = await this._customerRepo.saveSchedule(schedule, customer_id);
    if(status) {
      this.schedule_status = NetworkStatus.Updated
    } else {
      this.schedule_status = NetworkStatus.UpdateFailed
    }
  }
}
