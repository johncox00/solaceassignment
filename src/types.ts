export interface IAdvocate {
  id: string;
  uuid: string;
  firstName: string;
  lastName: string;
  city: string;
  degree: 'MD' | 'PhD' | 'MSW'; // Based on seed data
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: string;
  createdAt?: Date;
}

export interface IAdvocatesResponse {
  data: IAdvocate[];
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export type SortBy = 'firstName' | 'lastName' | 'city' | 'degree' | 'yearsOfExperience';
export type SortOrder = 'asc' | 'desc';
