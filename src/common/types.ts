export interface Geo {
    lat: string;
    lng: string;
  }

 export interface Address {
    street: string;
    city: string;
    zipcode: string;
    geo?: Geo;
  }
  
 export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
  }
  