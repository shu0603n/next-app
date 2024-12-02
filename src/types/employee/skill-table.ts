import { ParameterType, SkillParameterType } from 'types/parameter/parameter';

export type SkillTableType = {
  id: number;
  employee_id: number;
  start_date: string;
  end_date: string;
  project_title: string;
  description: string;
  people_number: number;
  client?: ClientType;
  client_name: string;
  project_position?: ParameterType;
  employee_project_skills?: Array<SkillType>;
  employee_project_processes?: Array<ProcessType>;
};

export type SkillType = {
  skill: SkillParameterType;
};

export type ProcessType = {
  process: ParameterType;
};

export type ClientType = {
  id: number;
  name: string;
  name_k: string;
  address: string;
  phone: string;
  email: string;
  postal_code: string;
  remarks: string;
};
