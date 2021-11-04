import Customer from "../domain/Customer";

export default interface ICustomerRepo {
  getCustomers: () => Promise<Customer[] | []>;
  saveSchedule: (schedule: string, customer_id: string) => Promise<boolean>;
}