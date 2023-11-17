export type ParameterType = {
  id: number;
  name: string;
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
