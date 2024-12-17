export type InvoiceTableType = {
  id: number;
  start_date: string;
  end_date: string;
  invoice_date: string;
  employee_id: number;
  client_id: number;
  client_name: string;
  project_id: number;
  project_name: string;
  contract_price: number;
  invoice_amount: number;
  working_hours: number;
  payment_flg: boolean;
};
