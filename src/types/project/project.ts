import { ParameterType, SkillParameterType } from '../parameter/parameter';

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
};

export type ProjectDataList = {
  project: Array<ProjectType>;
  skill: Array<SkillParameterType>;
  client: Array<ParameterType>;
  contract: Array<ParameterType>;
  process: Array<ParameterType>;
};

export type ProjectCard = ProjectType & {
  project_process: Array<{ process: ParameterType }>;
  project_skills: Array<{ skill: ParameterType }>;
};
