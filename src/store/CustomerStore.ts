import { makeAutoObservable } from "mobx";
import Customer, { NetworkStatus } from "../domain/Customer";
import { Profile } from "../domain/Profile";
import ICustomerRepo from "../infra/ICustomerRepo";
import { RootStore } from "./RootStore";
import _ from 'lodash';
import { AuthStatus } from "../domain/Auth";

type cust_info = {first_name: string, last_name: string, email: string, password: string};

export class CustomerStore {
  network_status = NetworkStatus.Loading;
  customers: Customer[] | [] = [];

  _customerRepo: ICustomerRepo;
  _rootStore: RootStore;

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
}
