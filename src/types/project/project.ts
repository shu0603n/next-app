import { ParameterType, SkillParameterType, EmployeeParameterType } from '../parameter/parameter';

export type ProjectType = {
  id: number;
  start_date: Date;
  end_date: Date;
  hp_posting_flag: boolean;
  client: ParameterType;
  contract: ParameterType;
  working_postal_code: string;
  working_address: string;
  working_start_time: string;
  working_end_time: string;
  holiday: string;
  project_title: string;
  description: string;
  price: string;
  employee: EmployeeParameterType;
  dispatch_source: string;
  fertilizer_type: string;
  training_schedule: string;
  trial_period_duration: string;
  training_memo: string;
  contract_period: string;
  working_days_count: string;
  working_days_list: string;
  working_hours_per_day: string;
  work_notes: string;
  price_type: string;
  transportation_expenses: string;
  overtime_hours: string;
  welfare_programs: string;
  work_environment_description: string;
  dress_code: string;
  gender_ratio: string;
  environmental_notes: string;
  special_notes: string;
  hr_requirements: string;
  gender_requirements: string;
  age_requirements: string;
  recruitment_count: string;
};

export type ProjectDataList = {
  skill: Array<SkillParameterType>;
  client: Array<ParameterType>;
  contract: Array<ParameterType>;
  process: Array<ParameterType>;
  employee: Array<EmployeeParameterType>;
};

export type ProjectCard = ProjectType & {
  project_process: Array<{ process: ParameterType }>;
  project_skills: Array<{ skill: ParameterType }>;
};
