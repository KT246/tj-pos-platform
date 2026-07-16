export type ProvisionPosClientBody = {
  businessName?: string;
  ownerName?: string;
  phone?: string;
  email?: string;
  slug?: string;
  posType?: string;
  username?: string;
  password?: string;
  plan?: string;
  startDate?: string;
  durationMonths?: number;
};

export type ProvisionPosClientResponse = {
  business: {
    id: string;
    name: string;
    slug: string;
    type: string;
    status: "active";
  };
  owner: {
    id: string;
    name: string;
    username: string;
    email: string;
  };
  subscription: {
    id: string;
    plan: string;
    startsOn: string;
    endsOn: string;
    status: "active";
  };
};
