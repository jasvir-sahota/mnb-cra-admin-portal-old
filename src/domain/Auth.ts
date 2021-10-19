enum RoleType {
  TrainingPlan,
  DietPlan,
  Macros,
  All,
  Incomplete,
}
type credentials = {
  email: string;
  password: string;
};
type Auth_Payload = {
  id: string;
  role: RoleType;
};

type Auth_Response = {
  payload?: Auth_Payload;
  status: AuthStatus;
  token?: string;
};

enum AuthStatus {
  UnAuthenticated,
  Auhtenticated,
  IsAuthenticating,
  Failed,
}

type role = {
  type: RoleType;
  description: string;
};

export type { credentials, role, Auth_Payload, Auth_Response };
export { AuthStatus, RoleType };
