export const checkResponse = ( response: Response ) => {
  if ( response.status !== 200 ) {
    throw response.statusText;
  }
  return response;
};
