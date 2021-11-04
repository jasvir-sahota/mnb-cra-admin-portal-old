import { makeAutoObservable } from "mobx";
import { ActiveComponent } from "../domain/App";

export class AppStore {
  active_component: ActiveComponent = ActiveComponent.Dashboard;

  constructor() {
    makeAutoObservable(this);
  }
}