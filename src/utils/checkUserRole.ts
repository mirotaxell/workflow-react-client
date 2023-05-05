import {GET_USER_BY_ID} from '../graphql/graphql';
import {graphqlFetch} from '../graphql/graphqlFetch';

export async function checkUserRole(projectId?: string, companyId?: string) {
  try {
    const userData = localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user')!)
      : null;
    const token = localStorage.getItem('token');
    const userByIdId = userData.id;
    const user = await graphqlFetch(GET_USER_BY_ID, {userByIdId}, token || '');
    if (user.userById.role === 'admin') {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
