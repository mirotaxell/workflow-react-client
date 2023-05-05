import { Employee } from "./user";

  export type IProject = {
    id: string;
    project_name: string;
    supervisor: Employee;
  }

  export interface IProjects {
    projects: IProject[];
  }
  
  export interface IProjectsByCompany {
    projectsByCompany: IProject[];
  }
  
  export interface IProjectById {
    projectById: IProject;
  }