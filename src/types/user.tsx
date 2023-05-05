interface User {
  id?: string;
  user_name?: string;
  token?: string;
}

interface Employee {
  id?: string;
  full_name?: string;
}

interface Credentials {
  username: string;
  password: string;
}

export default interface LoginMessageResponse {
  login: {
    token?: string;
    message: string;
    user: User;
  };
}

export type IToken = {
  message: string;
  token: string;
}

export type {User, Credentials, Employee};