export type ProjectTableType = {
  id: number;
  hp_posting_flag: boolean;
  client_name: string;
  project_title: string;
  description: string;
  working_start_time: string;
  working_end_time: string;
  start_date: string;
  end_date: string;
  working_postal_code: string;
  working_address: string;
  holiday: string;
  contract_name: string;
  fertilizer_type: string;
  trial_period_duration: String;
  training_schedule: String;
  training_memo: String;
  dispatch_source: String;
  sei: String;
  price: String;
  transportation_expenses: String;
  overtime_hours: String;
  welfare_programs: String;
  work_environment_description: String;
  dress_code: String;
  gender_ratio: String;
  working_days_count: String;
  working_days_list: String;
  work_notes: String;
  contract_period: String;
  price_type: number;
  environmental_notes: String;
  special_notes: String;
  hr_requirements: String;
  gender_requirements: String;
  age_requirements: String;
  recruitment_count: String;
};

export type ClientType = {
  id: number;
  client_name: string;
};

export type EmployeeType = {
  id: number;
  sei: string;
};

export type ContractType = {
  id: number;
  name: string;
};

export type SkillType = {
  id: number;
  name: string;
  technic_name?: string;
  candidate_flag: boolean;
};

export type ProcessType = {
  id: number;
  name: string;
};
