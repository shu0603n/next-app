import { ParameterType } from 'types/parameter/parameter';

export type staffType = {
  id: number;
  name: string;
  mail: string;
  age?: number;
  birthday?: Date;
  staff_status: ParameterType;
  flag?: string;
};
