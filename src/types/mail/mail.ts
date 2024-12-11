import { staffType } from 'types/staff/staff';

export type mailListType = {
  id: number;
  title: string;
  main_text: string;
  staff?: staffType;
};
