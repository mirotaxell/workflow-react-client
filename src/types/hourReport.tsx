import { Employee } from "./user";

export type IHourReport = {
    id: string;
    project: string;
    task: string;
    time_worked: string;
    employee: Employee
    posted_at: Date;
  };
  
  export interface IHourReports {
    hourReports: IHourReport[];
  }
  
  export interface IHourReportsByProject {
    hourReportsByProject: IHourReport[];
  }
  