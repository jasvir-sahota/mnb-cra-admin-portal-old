import axios from "axios";
import { AuthStatus, Auth_Response, credentials } from "../domain/Auth";
import { IAuthRepo } from "./IAuthRepo";
import httpstatus from "http-status";
import base64 from "base-64";
import { RoleType } from "../domain/Auth";

export class AuthRepo implements IAuthRepo {

  private authRoleLookup(auth_role: string) : RoleType {
    switch (auth_role) {
      case "Incomplete":
        return RoleType.Incomplete

      case "Training":
        return RoleType.TrainingPlan

      case "Diet":
        return RoleType.DietPlan
        
      case "Premium":
        return RoleType.All
      default:
        return RoleType.Incomplete;
    }
  }

  async authenticate(credentials: credentials): Promise<Auth_Response> {
    const promise = new Promise<Auth_Response>(async (resolve, reject) => {
      try {
        const response = await axios({
          method: 'post',
          url: 'https://api.mnbfitness.ca/api/v1/auth',
          data: {
            email: credentials.email,
            password: credentials.password
          },
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin' : '*'
          }
        });
        if (response.status !== httpstatus.OK) {
          resolve({
            status: AuthStatus.Failed
          });
        }

        const token = response.data as string;
        const base64Payload = token.split(".")[1];
        const decodedPayload = base64.decode(base64Payload) as any
        const payload = JSON.parse(decodedPayload);

        console.log(decodedPayload);
        const role = this.authRoleLookup(payload.role);
        resolve({
          payload: {
            id: payload.id,
            role
          },
          status: AuthStatus.Auhtenticated,
          token: response.data
        })
      } catch (error) {
        console.log(error);
        resolve({
          status: AuthStatus.Failed
        });
      }
    });
    
    return promise;
  }
}