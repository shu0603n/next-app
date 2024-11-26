export type SkillTableType = {
  id: number;
  employee_id: number;
  employee_project_skills_id: number;
  start_date: string;
  end_date: string;
  project_title: string;
  description: string;
  people_number: number;
  client_id: number;
  process_list_id: number;
  client_name: string;
  skill?: skill[];
};
export type skill = {
  id: number;
  name: number;
  technic_name?: string;
  candidate_flag: boolean;
};

export type processType = {
  id: number;
  name: number;
};

export type projectPositionType = {
  id: number;
  name: string;
  description: string;
};

export type clientType = {
  id: number;
  name: string;
  name_k: string;
  address: string;
  phone: string;
  email: string;
  postal_code: string;
  remarks: string;
};
