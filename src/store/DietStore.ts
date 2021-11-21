import { makeAutoObservable } from "mobx";
import { NetworkStatus } from "../domain/Customer";
import { DietPlan } from "../domain/Diet";
import IDietPlanRepo from "../infra/IDietRepo";
import { RootStore } from "./RootStore";
import _ from 'lodash';

export class DietStore {
  _DietPlanRepo : IDietPlanRepo;
  _rootStore: RootStore;
  plans: DietPlan[] | [] = [];
  diets: any[] | [] = [];
  network_status = NetworkStatus.Loading;
  diet_status = NetworkStatus.Loading;
  plan_status = NetworkStatus.Loading;

  constructor(DietplanRepo: IDietPlanRepo, rootStore: RootStore) {
    makeAutoObservable(this, {_rootStore: false, _DietPlanRepo: false});
    this._rootStore = rootStore;
    this._DietPlanRepo = DietplanRepo;
    this.fetchDiets();
    this.fetchPlans();
  }

  async fetchPlans() {
    const plans = await this._DietPlanRepo.getAllPlans();
    console.log(plans);
    this.plans = plans;
    this.plan_status = NetworkStatus.Loaded;
  }

  async fetchDiets() {
    const diets = await this._DietPlanRepo.getDiets();
    this.diets = diets;
    this.diet_status = NetworkStatus.Loaded;
    console.log(diets);
  }

  async saveDiet(Diet: any) {
    try {
      console.log(Diet);

      if(Diet) {
        this.diet_status = NetworkStatus.Updating;
        await this._DietPlanRepo.saveDiet(Diet);
        const Diet_copy : any = _.cloneDeep(Diet);
        this.diets = [...this.diets, Diet_copy];
        console.log(this.diets);
        this.diet_status = NetworkStatus.Updated;
      }
    } catch (error) {
      this.diet_status = NetworkStatus.UpdateFailed;
    }
  }

  async savePlan(plan: any) {
    this.plan_status = NetworkStatus.Updating;
    const status = await this._DietPlanRepo.saveDietPlan(plan);
    console.log(status);
    if (status) {
      this.plan_status = NetworkStatus.Updated;
      this.fetchPlans();
    } else {
      this.plan_status = NetworkStatus.UpdateFailed;
    }
  }
}