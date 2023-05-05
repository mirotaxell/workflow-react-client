import { IItem } from "./item";
import { IProject } from "./project";
import { Employee } from "./user";

export type IInventory = {
  id: string;
  project: IProject;
  items: IItem[];
  supervisor: Employee
};

export interface IInventoryByProject {
  inventoryByProjectId: IInventory;
}