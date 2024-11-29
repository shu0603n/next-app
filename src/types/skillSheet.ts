// ==============================|| INVOICE - SLICE ||============================== //

export interface InfoType {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface CountryType {
  code: string;
  label: string;
  currency: string;
  prefix: string;
}

export interface ProjectCard {
  id: number;
  start_date: string;
  end_date: string;
  people: number;
  client: string;
  project_title: string;
  description: string;
  skills: string[];
  process: string[];
  time: string;
}

export interface SkillSheetList {
  id: number;
  sei: string;
  mei: string;
  birthday: number;
  address: string;
  project: Array<ProjectCard>;
}

export interface SkillSheetProps {
  isOpen: boolean;
  isCustomerOpen: boolean;
  open: boolean;
  country: CountryType | null;
  countries: CountryType[];
  lists: SkillSheetList[];
  list: SkillSheetList | null;
  error: object | string | null;
  alertPopup: boolean;
}

export interface SkillSheetList {
  id: number;
  sei: string;
  mei: string;
  birthday: number;
  address: string;
  project: ProjectCard[];
}
