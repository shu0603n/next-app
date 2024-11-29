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
};

export type clientType = {
  id: number;
  name: string;
};

export type employeeType = {
  id: number;
  sei: string;
};
