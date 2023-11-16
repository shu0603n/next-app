type ParameterType = {
  id: number;
  name: string;
}
export type ProjectType = {
  id: number;
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
};
