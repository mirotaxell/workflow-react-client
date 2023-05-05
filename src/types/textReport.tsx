import { Employee } from "./user";

export type ITextReport = {
    id: string;
    title: string;
    text: string;
    project: string;
    employee: Employee;
    posted_at: Date;
  };
  
  export interface ITextReports {
    textReports: ITextReport[];
  }
  
  export interface ITextReportsByProject {
    textReportsByProject: ITextReport[];
  }
  