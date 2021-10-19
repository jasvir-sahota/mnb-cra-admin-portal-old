import { Auth_Response, credentials } from "../domain/Auth";

export interface IAuthRepo {
  authenticate(credentials: credentials): Promise<Auth_Response>;
}