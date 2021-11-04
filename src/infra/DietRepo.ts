import { DietPlan } from "../domain/Diet";
import IDietPlanRepo from "./IDietRepo";
import axios from "axios";
import httpStatus from "http-status";

export class DietRepo implements IDietPlanRepo {

  API_HOST : string = 'https://api.mnbfitness.ca/';

  constructor() {
    const { REACT_APP_API_HOST } = process.env;

    console.log(REACT_APP_API_HOST);
    if (REACT_APP_API_HOST) {
      this.API_HOST = REACT_APP_API_HOST;
    }
  }

  async getAllPlans() : Promise<DietPlan[] |[]> {
    try {
      const res = await axios.get(`${this.API_HOST}api/v1/admin/diet-plans/`, {
        withCredentials: true,
        headers: {
         'Access-Control-Allow-Credentials': "true",
         'Access-Control-Allow-Origin' : '*',
       },
     });

     const diet_plans = res.data as DietPlan[] | [];
     console.log(diet_plans)
     return diet_plans;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async saveDiet(Diet: any) : Promise<string> {
    try {
      const response = await axios.post(`${this.API_HOST}api/v1/admin/diet/`, {
        ...Diet,
        withCredentials: true,
        headers: {
         'Access-Control-Allow-Credentials': "true",
         'Access-Control-Allow-Origin' : '*',
       },
     });

     if(response.status === httpStatus.OK) {
      return response.data.status;
    } else {
      throw new Error('Failed to save the Diet');
    }
    } catch (error) {
      console.error(error);
      throw new Error('Failed to save the Diet');
    }
  }

  async saveDietPlan(plan: any) : Promise<boolean> {
    try {
      const response = await axios.post(`${this.API_HOST}api/v1/admin/diet-plans/`, {
        ...plan,
        withCredentials: true,
        headers: {
         'Access-Control-Allow-Credentials': "true",
         'Access-Control-Allow-Origin' : '*',
       },
     });

     if(response.status === httpStatus.OK) {
      return true;
    } else {
      return false;
    }
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  async getDiets() : Promise<any[] | []> {
    try {
      const res = await axios.get(`${this.API_HOST}api/v1/admin/diets/`, {
        withCredentials: true,
        headers: {
         'Access-Control-Allow-Credentials': "true",
         'Access-Control-Allow-Origin' : '*',
       },
     });

     const diets = res.data ;
     console.log(diets);
     return diets
    } catch (error) {
      console.error(error);
      return []
    }
  }
}