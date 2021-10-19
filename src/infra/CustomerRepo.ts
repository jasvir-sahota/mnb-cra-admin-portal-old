import axios from "axios";
import Customer from "../domain/Customer";
import ICustomerRepo from "./ICustomerRepo";

export class CustomerRepo implements ICustomerRepo {
  async getCustomers(): Promise<Customer[] | []> {
    try {
      const res = await axios.get(`https://api.mnbfitness.ca/api/v1/customers/`,
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