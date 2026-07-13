export type PosAccountStatus = "active" | "inactive";

export type PosAccount = {
  id: string;
  username: string;
  status: PosAccountStatus;
  createdAt: string;
  updatedAt: string;
};

export type SavePosAccountBody = {
  username?: string;
  password?: string;
  status?: PosAccountStatus;
};

export type PosAccountListResponse = {
  accounts: PosAccount[];
};
