import axios from "axios";
import Customer from "../domain/Customer";
import ICustomerRepo from "./ICustomerRepo";


export class CustomerRepo implements ICustomerRepo {
  async getCustomers(): Promise<Customer[] | []> {
    try {
      let { REACT_APP_API_HOST } = process.env;

      if(!REACT_APP_API_HOST) {
        console.log('api host not set');
        REACT_APP_API_HOST = 'https://api.mnbfitness.ca/';
      }    

      const res = await axios.get(`${REACT_APP_API_HOST}api/v1/customers/`,
      {
        withCredentials: true,
        headers: {
         'Access-Control-Allow-Credentials': 'true',
         'Access-Control-Allow-Origin' : '*',
       },
      }
      );

      const customers = res.data as Customer[] | [];
      console.log(customers);
      return customers;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}