// React
import { Dispatch } from "react";

// State
import { typeOptions } from "./reducers";

// Model
import IActionObjectModel from "../models/IActionObject.model";
import IFlickrPhotoModel from "../models/IFlickrPhoto.model";

// Utility
import fetch from "cross-fetch";

// Constant
import { BASIC_JSON_HEADERS, FLICKR_API_KEY, FLICKR_URL, PAGE_SIZE } from "../constant";

export const searchFlickrPhoto = (
  searchText: string,
  dispatch: Dispatch<any>,
  page: number,
  lastResult: IFlickrPhotoModel[],
  actionPassThrough: IActionObjectModel,
) => {
  // Dispatch IS_LOADING action along with a notification
  dispatch( {
    ...actionPassThrough,
    message: lastResult.length > 0 ? `Loading more "${searchText}"...` : `Searching for "${searchText}"`,
    type: typeOptions.IS_LOADING,
  } );
  // tslint:disable-next-line:max-line-length
  const url = `${FLICKR_URL}?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&text=${searchText}&format=json&nojsoncallback=1&per_page=${PAGE_SIZE}&page=${page}&safe_search=1`;
  return fetch( url, {
    headers: BASIC_JSON_HEADERS,
    method: "GET",
  })
  .then( ( response ) => response.json() )
  .then( ( json ) => {
    setTimeout( () => {
    const photos: IFlickrPhotoModel[] = [ ...lastResult, ...json.photos.photo ];
    dispatch(
      {
          ...actionPassThrough,
        message: `Search for "${searchText}" has completed`,
        pages: json.photos.pages,
        result: photos,
        type: typeOptions.FETCHED_PHOTOS,
      } );
    }, 500);
  } )
  .catch( () => {
    dispatch( { type: typeOptions.IS_NOT_LOADING } );
  } );
};
