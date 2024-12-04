import { ParameterType } from 'types/parameter/parameter';

export type ClientHistoryType = {
  id: number;
  client_id: number;
  name: string;
  gender: string;
  age: string;
  time: string;
  remarks: string;
  client_position: ParameterType;
  employee_id: number;
};
