export type ParameterType = {
  id: number;
  name: string;
};

export type EmployeeParameterType = {
  id: number;
  sei: string;
  mei: string;
};

export type MailAccountParameterType = {
  name: number;
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
