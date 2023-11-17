import { ParameterType, SkillParameterType } from '../parameter/parameter';

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

export type ProjectDataList = {
  project: Array<ProjectType>;
  skill: Array<SkillParameterType>;
  client: Array<ParameterType>;
  contract: Array<ParameterType>;
  process: Array<ParameterType>;
};
