import {CHECK_TOKEN} from '../graphql/graphql';
import {graphqlFetch} from '../graphql/graphqlFetch';

export async function checkToken(token: string) {
  try {
    const isTokenValid = await graphqlFetch(CHECK_TOKEN, {}, token);
    if (isTokenValid.checkToken?.message === 'Token is valid') {
      const user = isTokenValid.checkToken.user;
      return true;
    }
  } catch (error) {
    return false;
  }
}
