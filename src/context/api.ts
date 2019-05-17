// React
import { Dispatch } from "react";

// State
import { typeOptions } from "./reducers";

// Utility
import fetch from "cross-fetch";
import { acceptJsonHeaders, FLICKR_API_KEY, FLICKR_URL } from "./common";

export const searchFlickrPhoto = ( searchText: string, dispatch: Dispatch<any> ) => {
  dispatch( { type: typeOptions.IS_LOADING } );
  // tslint:disable-next-line:max-line-length
  const url = `${FLICKR_URL}?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&text=${searchText}&format=json&nojsoncallback=1`;
  return fetch( url, {
    headers: acceptJsonHeaders,
    method: "GET",
  })
  .then( ( response ) => response.json() )
  .then( ( json ) => {
    // tslint:disable-next-line:no-console
    console.log( json );
  } )
  .finally( () => {
    dispatch( { type: typeOptions.IS_NOT_LOADING } );
  } );
};
