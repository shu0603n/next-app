export type ParameterType = {
  id: number;
  name: string;
  description?: string;
};

export type EmployeeParameterType = {
  id: number;
  sei: string;
  mei: string;
};

export type MailAccountParameterType = {
  id: number;
  name: string;
  user: string;
  pass: string;
};

export type SkillParameterType = {
  id: number;
  name: string;
  technic: ParameterType;
  candidate_flag: boolean;
};

export type SkillArrayType = {
  skill: SkillParameterType;
};

export type ProcessArrayType = {
  process: ParameterType;
};
