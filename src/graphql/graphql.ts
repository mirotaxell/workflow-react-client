import gql from 'graphql-tag';

export const GET_COMPANIES = gql`
  {
    companies {
      id
      company_name
    }
  }
`;

export const GET_PROJECTS = gql`
  {
    projects {
      id
      project_name
    }
  }
`;

export const GET_PROJECT_BY_ID = gql`
  query projectById($projectId: ID!) {
    projectById(projectId: $projectId) {
      id
      project_name
      supervisor {
        id
        full_name
      }
    }
  }
`;

export const GET_PROJECTS_BY_COMPANY = gql`
  query projectsByCompany($companyId: ID!) {
    projectsByCompany(company_id: $companyId) {
      id
      project_name
    }
  }
`;

export const GET_TASKS_BY_PROJECT = gql`
  query tasksByProjectId($projectId: ID!) {
    tasksByProjectId(projectId: $projectId) {
      id
      title
      description
      status
    }
  }
`;

export const GET_HOUR_REPORTS_BY_PROJECT = gql`
  query Query($projectId: ID!) {
    hourReportsByProject(projectId: $projectId) {
      id
      task
      time_worked
      posted_at
      employee {
        id
        full_name
      }
    }
  }
`;

export const GET_TEXT_REPORTS_BY_PROJECT = gql`
  query Query($projectId: ID!) {
    textReportsByProject(projectId: $projectId) {
      id
      title
      text
      posted_at
      employee {
        id
        full_name
      }
    }
  }
`;

export const GET_INVENTORY_BY_PROJECT = gql`
  query Query($projectId: ID!) {
    inventoryByProjectId(projectId: $projectId) {
      id
      items {
        id
        item_name
        amount
      }
      project {
        id
        project_name
        supervisor {
          id
          full_name
        }
      }
    }
  }
`;

export const CHECK_TOKEN = `
  {
    checkToken {
      message
      token
      user {
        email
        full_name
        id
      }
    }
  }
`;

export const GET_USER_BY_ID = `
  query Query($userByIdId: ID!) {
    userById(id: $userByIdId) {
      full_name
      role
      id
      email
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      message
      token
      user {
        id
        full_name
        email
      }
    }
  }
`;

export const CREATE_COMPANY = gql`
  mutation AddCompany($companyName: String!) {
    addCompany(company_name: $companyName) {
      company_name
      id
    }
  }
`;

export const CREATE_PROJECT = gql`
  mutation AddProject($projectName: String!, $companyId: ID!) {
    addProject(project_name: $projectName, company_id: $companyId) {
      project_name
      id
    }
  }
`;

export const CREATE_HOUR_REPORT = gql`
  mutation Mutation($task: String!, $projectId: ID!, $timeWorked: String!) {
    addHourReport(
      task: $task
      projectId: $projectId
      time_worked: $timeWorked
    ) {
      id
      task
      time_worked
      posted_at
    }
  }
`;

export const CREATE_TEXT_REPORT = gql`
  mutation Mutation($projectId: ID!, $title: String!, $text: String!) {
    addTextReport(projectId: $projectId, title: $title, text: $text) {
      id
      title
      text
      posted_at
    }
  }
`;

export const CREATE_ITEM = gql`
  mutation Mutation($itemName: String!, $amount: String!) {
    addItem(item_name: $itemName, amount: $amount) {
      item_name
      id
      amount
    }
  }
`;

export const ADD_ITEM_TO_INVENTORY = gql`
  mutation Mutation($inventoryId: ID!, $itemId: ID!) {
    addItemToInventory(inventoryId: $inventoryId, itemId: $itemId) {
      id
    }
  }
`;

export const CREATE_ITEM_AND_ADD_TO_INVENTORY = gql`
  mutation Mutation($itemName: String!, $amount: String!, $inventoryId: ID!) {
    addItemAndAddToInventory(
      item_name: $itemName
      amount: $amount
      inventoryId: $inventoryId
    ) {
      id
    }
  }
`;

export const CREATE_INVENTORY = gql`
  mutation Mutation($projectId: ID!) {
    addInventory(projectId: $projectId) {
      id
    }
  }
`;

export const UPDATE_ITEM = gql`
  mutation Mutation($updateItemId: ID!, $itemName: String, $amount: String) {
    updateItem(id: $updateItemId, item_name: $itemName, amount: $amount) {
      item_name
      amount
    }
  }
`;

export const DELETE_HOUR_REPORT = gql`
  mutation Mutation($id: ID!) {
    deleteHourReport(id: $id) {
      id
    }
  }
`;

export const DELETE_TEXT_REPORT = gql`
  mutation Mutation($id: ID!) {
    deleteTextReport(id: $id) {
      id
    }
  }
`;

export const DELETE_ITEM = gql`
  mutation Mutation($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

export const SIGNUP_MUTATION = gql`
  mutation Register($full_name: String!, $email: String!, $password: String!) {
    register(full_name: $full_name, email: $email, password: $password) {
      token
      message
    }
  }
`;
