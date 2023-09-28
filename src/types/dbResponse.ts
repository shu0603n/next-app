export type dbResponse = {
  data: sqlResult;
};

export type sqlResult = {
  command: string;
  fields: Array<any>;
  rowAsArray: boolean;
  rowCount: number;
  rows: Array<any>;
  viaNeonFetch: boolean;
};
