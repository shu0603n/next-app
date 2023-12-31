export type SkillTableType = {
  id: number;
  employee_id: number;
  skills_used_id: number;
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
  technic_name: string;
};
