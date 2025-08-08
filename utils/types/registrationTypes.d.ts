export interface RegistrationData {
  name: string;
  email: string;
  password: string;
  address: {
    first_name: string;
    last_name: string;
    address: string;
    address2: string;
    country: string;
    state: string;
    city: string;
    zipcode: string;
    mobile_number: string;
  };
}
