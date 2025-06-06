import mongoose,{Document,Types} from "mongoose";

export interface IGig extends Document {
    title: string;
    description: string;
    category: string;
    price: number;
    revisions: number;
    deliveryTime: string;
    skills: string[];
    requirements: string[];
    freelancerId: Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
    isActive: boolean;
}

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

export interface UpdateGigDTO {
    _id:string;
    title: string;
    description: string;
    category: string;
    price: number;
    revisions: number;
    deliveryTime: string;
    skills: string[];
    requirements: string[];
}
