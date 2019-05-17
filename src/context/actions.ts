// React
import { Dispatch } from "react";

// Models
import IStateModel from "../models/IState.model";
import { searchFlickrPhoto } from "./api";
import { typeOptions } from "./reducers";

export const useActions = (state: IStateModel, dispatch: Dispatch<any>) => {

  /**
   * Search Flick if is not currently loading
   */
  const searchFlickr = ( searchText: string ): void => {
    if ( !state.isLoading ) {
      searchFlickrPhoto( searchText, dispatch );
    }
    dispatch( {
      text: searchText,
      type: typeOptions.UPDATE_SEARCH,
    } );
  };

  return {
      searchFlickr,
  };
};
