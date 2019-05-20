// React
import { Dispatch, ReactText } from "react";

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

  /**
   * Collect all params as an object
   */
  const upsPackage = {
    api_key: FLICKR_API_KEY,
    format: "json",
    method: "flickr.photos.search",
    nojsoncallback: "1",
    page,
    per_page: PAGE_SIZE,
    safe_search: "1",
    text: searchText,
  };

  const convertEntriesToParam = ( item: [string, ReactText] ): string => `${item[0]}=${item[1]}`;
  const upsPackageToParamString = Object.entries(upsPackage).map( convertEntriesToParam ).join("&");
  const url = `${FLICKR_URL}?${upsPackageToParamString}`;

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
        message: lastResult.length > 0 ? `More "${searchText}" has loaded` : `Search for "${searchText}" has completed`,
        pages: json.photos.pages,
        result: photos,
        type: typeOptions.FETCHED_PHOTOS,
      } );
    }, 500);
  } )
  .catch( () => {
    dispatch( { type: typeOptions.IS_NOT_LOADING, message: `Error: Unable to retrieve images for "${searchText}"` } );
  } );
};
