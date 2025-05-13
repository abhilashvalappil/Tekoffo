export interface CreateGigDTO {
    title: string;
    description: string;
    category: string;
    price: number;
    revisions: number;
    deliveryTime: string;
    skills: string[];
    requirements: string[];
}

export interface Gig {
  _id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  revisions: number;
  deliveryTime: string;
  skills: string[];
  requirements: string[];
}