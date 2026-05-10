// ----------------------------------------------------------------------

export type InvoiceAddress = {
  id: string;
  name: string;
  address: string;
  company: string;
  email: string;
  phone: string;
};

export type InvoiceItem = {
  id: string;
  title: string;
  description: string;
  quantity: number;
  price: number;
  total: number;
  service: string;
};

export type Invoice = {
  _id: string;
  user_id: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  subscription_id: {
    _id: string;
    start_date: string;
    end_date: string;
  };
  plan_id: {
    _id: string;
    name: string;
    duration: number;
    token_limit: number;
  };
  amount: number;
  currency: string;
  status: string;
  payment_gateway: string;
  order_id: string;
  receipt: string;
  initiated_at: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
  __v: 0;
};
