// React
import { Dispatch } from "react";

// State
import { typeOptions } from "./reducers";

// Model
import IActionObjectModel from "../models/IActionObject.model";
import IFlickrPhotoModel from "../models/IFlickrPhotoModel";

// Utility
import fetch from "cross-fetch";
import { acceptJsonHeaders, FLICKR_API_KEY, FLICKR_URL } from "./common";

// Constant
import { PAGE_SIZE } from "../constant";

export const searchFlickrPhoto = (
  searchText: string,
  dispatch: Dispatch<any>,
  page: number,
  lastResult: IFlickrPhotoModel[],
  actionPassThrough: IActionObjectModel,
) => {
  dispatch( { type: typeOptions.IS_LOADING } );
  // tslint:disable-next-line:max-line-length
  const url = `${FLICKR_URL}?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&text=${searchText}&format=json&nojsoncallback=1&per_page=${PAGE_SIZE}&page=${page}&safe_search=1`;
  return fetch( url, {
    headers: acceptJsonHeaders,
    method: "GET",
  })
  .then( ( response ) => response.json() )
  .then( ( json ) => {
    setTimeout( () => {
    const photos: IFlickrPhotoModel[] = [ ...lastResult, ...json.photos.photo ];
    dispatch( { ...actionPassThrough, type: typeOptions.FETCHED_PHOTOS, result: photos } );
    }, 500);
  } )
  .catch( () => {
    dispatch( { type: typeOptions.IS_NOT_LOADING } );
  } );
};
