import { ParameterType } from 'types/parameter/parameter';

export type EmployeeType = {
  id: number;
  sei: string;
  sei_k: string;
  mei: string;
  mei_k: string;
  gender: string;
  phone_number: string;
  email: string;
  address: string;
  birthday: string;
  joining_date: string;
  retirement_date: string;
  client_id: number;
  employee_project_id: number;
  employment: ParameterType;
  job_category_id: number;
  job_category_name: string;
  position: ParameterType;
  postal_code: string;
  project_id: number;
  remarks: string;
  avatar: string;
  status: number;
};
