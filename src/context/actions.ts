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
  const searchFlickr = ( searchText: string = state.search.text, newSearchFlag: boolean = false  ): void => {

    if ( !state.isLoading && searchText !== "" ) {
      const oldHistory = state.search.history;
      const newHistory = oldHistory.includes( searchText ) ? oldHistory : [...oldHistory, searchText ];

      // If the searchText has not changed, load the next page for the same searchText
      if ( state.search.text === searchText && !newSearchFlag ) {
        const nextPage = state.search.page + 1;
        searchFlickrPhoto( searchText, dispatch, nextPage, state.search.result, {
          history: newHistory,
          page: nextPage,
          text: searchText,
          type: typeOptions.UPDATE_SEARCH,
        } );

      // Start a new search
      } else {
        searchFlickrPhoto( searchText, dispatch, 1, [], {
          history: [...oldHistory, searchText ],
          page: 1,
          text: searchText,
          type: typeOptions.UPDATE_SEARCH,
        } );
      }

    // If is loading, only update the searchText, do not call API
    } else {
      dispatch( {
        text: searchText,
        type: typeOptions.UPDATE_SEARCH,
      } );
    }

  };

  return {
      searchFlickr,
  };
};
