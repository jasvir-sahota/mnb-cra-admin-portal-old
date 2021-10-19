import Customer from "../domain/Customer";

export default interface ICustomerRepo {
  getCustomers: () => Promise<Customer[] | []>;
}