// ==============================|| INVOICE - SLICE ||============================== //

import { ParameterType, SkillParameterType } from './parameter/parameter';
import { ClientType } from 'types/client/client';

export interface InfoType {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface CountryType {
  code: string;
  label: string;
  currency: string;
  prefix: string;
}

export interface ProjectCardType {
  id: number;
  start_date: string;
  end_date: string;
  people_number?: number;
  client?: ClientType;
  project_position?: ParameterType;
  project_title: string;
  description?: string;
  employee_project_skills?: SkillParameterType[];
  employee_project_processes?: ParameterType[];
  time: string;
}
export interface BasicCardType {
  id: number;
  sei: string;
  mei: string;
  birthday: number;
  address: string;
}

export interface SkillSheetType {
  id?: number;
  sei?: string;
  mei?: string;
  birthday?: number;
  address?: string;
  project?: Array<ProjectCardType>;
}

export interface SkillSheetListType {
  id: number;
  sei: string;
  mei: string;
  birthday: number;
  address: string;
  project: Array<ProjectCardType>;
}

export interface SkillSheetProps {
  isOpen: boolean;
  isCustomerOpen: boolean;
  open: boolean;
  country: CountryType | null;
  countries: CountryType[];
  lists: SkillSheetList[];
  list: SkillSheetList | null;
  error: object | string | null;
  alertPopup: boolean;
}

export interface SkillSheetList {
  id: number;
  sei: string;
  mei: string;
  birthday: number;
  address: string;
  project: ProjectCardType[];
}
