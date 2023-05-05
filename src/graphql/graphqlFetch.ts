export const graphqlFetch = async (
  query: string,
  variables: object,
  token?: string
) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch('https://workflow-graphql.azurewebsites.net/graphql', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) throw new Error(response.statusText);
  const json = await response.json();
  return json.data;
};
