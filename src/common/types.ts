export interface Geo {
    lat: string;
    lng: string;
  }

 export interface Address {
    street: string;
    city: string;
    zipcode: string;
    geo?: Geo | undefined;
  }
  
 export interface User {
    id?: number;
    name: string;
    userName: string;
    email: string;
    address: Address;
    phoneNumber: string;
  }
  