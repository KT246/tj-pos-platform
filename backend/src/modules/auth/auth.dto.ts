export type BusinessLoginBody = {
  email?: string;
  username?: string;
  password?: string;
  rememberMe?: boolean;
};

export type BusinessAuthUser = {
  id: string;
  name: string;
  email: string;
  username: string | null;
  status: string;
};

export type BusinessAuthBusiness = {
  id: string;
  slug: string;
  name: string;
  type: string;
  status: string;
};

export type BusinessLoginResponse = {
  accessToken: string;
  tokenType: "Bearer";
  user: BusinessAuthUser;
  business: BusinessAuthBusiness;
  role: string;
  permissions: string[];
  accountType?: "admin" | "pos";
};
