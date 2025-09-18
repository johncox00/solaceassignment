export interface IAdvocate {
  id: string;
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
