export type SkillTableType = {
  id: number;
  employee_id: number;
  skills_used_id: number;
  experience_years: string;
  project_title: string;
  job_description: string;
  people_number: string;
  client_id: number;
  process_list_id: number;
  client_name: string;
  skill?: skill[];
};
export type skill = {
  id: number;
  skill_id: number;
  skills_name: string;
  technic_name: string;
};
