export type ProjectTableType = {
  id: number;
  name: string;
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
