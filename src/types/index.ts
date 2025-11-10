export interface ICustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  createdAt: Date | string;
}
