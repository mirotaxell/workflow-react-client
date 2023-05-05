import { ICompanies } from "../types/company";
import { IProjects, IProjectsByCompany, IProjectById } from "../types/project";
import { DocumentNode, useQuery } from "@apollo/react-hooks";
import { IToken } from "../types/user";
import { IHourReportsByProject } from "../types/hourReport";
import { ITextReportsByProject } from "../types/textReport";
import { IInventoryByProject } from "../types/inventory";

export function useCompanyQuery(gqlQuery: DocumentNode) {
  const { loading, error, data } = useQuery<ICompanies>(gqlQuery);
  return { loading, error, data };
}

export function useProjectQuery(gqlQuery: DocumentNode) {
  const { loading, error, data } = useQuery<IProjects>(gqlQuery);
  return { loading, error, data };
}

export function useProjectByIdQuery(gqlQuery: DocumentNode, projectId: string) {
  const { loading, error, data } = useQuery<IProjectById>(gqlQuery, { variables: { projectId } });
  return { loading, error, data };
}

export function useProjectByCompanyQuery(gqlQuery: DocumentNode, companyId: string) {
  const { loading, error, data } = useQuery<IProjectsByCompany>(gqlQuery, { variables: { companyId } });
  return { loading, error, data };
}

export function useHourReportByProjectQuery(gqlQuery: DocumentNode, projectId: string) {
  const { loading, error, data } = useQuery<IHourReportsByProject>(gqlQuery, { variables: { projectId } });
  return { loading, error, data };
}

export function useTextReportByProjectQuery(gqlQuery: DocumentNode, projectId: string) {
  const { loading, error, data } = useQuery<ITextReportsByProject>(gqlQuery, { variables: { projectId } });
  return { loading, error, data };
}

export function useInventoryByProjectQuery(gqlQuery: DocumentNode, projectId: string) {
  const { loading, error, data } = useQuery<IInventoryByProject>(gqlQuery, { variables: { projectId } });
  return { loading, error, data };
}

export function useCheckTokenQuery(gqlQuery: DocumentNode) {
  const { loading, error, data } = useQuery<IToken>(gqlQuery);
  return { loading, error, data };
}

