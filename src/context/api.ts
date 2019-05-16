// React
import { Dispatch } from "react";

// Utility
import fetch from "cross-fetch";
import { acceptJsonHeaders, FLICKR_API_KEY, FLICKR_URL } from "./common";

export const searchPhoto = ( searchText: string ) => {
  return ( dispatch: Dispatch<any> ) => {
    const url = `${FLICKR_URL}?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&text=${searchText}&format=json`;
    dispatch( { } );
    return fetch( url, {
      headers: acceptJsonHeaders,
      method: "GET",
    })
    .then( ( response ) => response.json() )
    .then( ( json ) => {
      // tslint:disable-next-line:no-console
      console.log( json );
    } );
  };
};
