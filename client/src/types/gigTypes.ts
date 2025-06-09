export interface CreateGigDTO {
    title?: string;
    description?: string;
    category?: string;
    price?: number;
    revisions?: number;
    deliveryTime?: string;
    skills?: string[];
    requirements?: string[];
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

export interface FreelancerGigListDTO {
  _id: string;
  freelancer:{
    _id:string;
    fullName:string;
    profilePicture:string;
  }
  title: string;
  description: string;
  category: string;
  price: number;
  revisions: number;
  deliveryTime: string;
  skills: string[];
  requirements: string[];
  averageRating: number;
  totalReviews: number;
}