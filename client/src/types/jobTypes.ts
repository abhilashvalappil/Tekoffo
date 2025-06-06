export interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  budget: string | number;
  duration: string;
  postedDate: string;
  status: 'open' | 'inProgress' | 'completed';
  invited?: boolean;
  createdAt?: Date;
}

export interface Category {
  _id?: string;
  catId: string;
  name: string;
  subCategories: string[];
  isListed: boolean;
}