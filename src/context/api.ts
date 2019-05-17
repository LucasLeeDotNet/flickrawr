// React
import { Dispatch } from "react";

// State
import { typeOptions } from "./reducers";

// Model
import IFlickrPhotoModel from "../models/IFlickrPhotoModel";

// Utility
import fetch from "cross-fetch";
import { acceptJsonHeaders, FLICKR_API_KEY, FLICKR_URL } from "./common";

export const searchFlickrPhoto = ( searchText: string, dispatch: Dispatch<any> ) => {
  dispatch( { type: typeOptions.IS_LOADING } );
  // tslint:disable-next-line:max-line-length
  const url = `${FLICKR_URL}?method=flickr.photos.search&api_key=${FLICKR_API_KEY}&text=${searchText}&format=json&nojsoncallback=1&per_page=15`;
  return fetch( url, {
    headers: acceptJsonHeaders,
    method: "GET",
  })
  .then( ( response ) => response.json() )
  .then( ( json ) => {
    const photos = json.photos.photo;
    dispatch( { type: typeOptions.FETCHED_PHOTOS, result: [] } );
    dispatch( { type: typeOptions.IS_ANIMATING } );
    photos.reduce( ( result: IFlickrPhotoModel[], image: IFlickrPhotoModel , index: number  ): IFlickrPhotoModel[] => {
      const newPhotos = [
        ...result,
        image,
      ];
      setTimeout( () => {
        dispatch( { type: typeOptions.FETCHED_PHOTOS, result: newPhotos } );
      }, index * 300);
      setTimeout( () => {
        dispatch( { type: typeOptions.IS_NOT_ANIMATING } );
      }, ( photos.length - 3 ) * 300 );
      return newPhotos;
    }, [] );
  } )
  .finally( () => {
    dispatch( { type: typeOptions.IS_NOT_LOADING } );
  } );
};
