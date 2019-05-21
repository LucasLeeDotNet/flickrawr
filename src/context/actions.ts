// React
import { Dispatch } from "react";

// Models
import IStateModel from "../models/IState.model";
import SearchModel from "../models/Search.model";
import { searchFlickrPhoto } from "./api";
import { typeOptions } from "./reducers";

// Constants
import { ACCEPETED_PREFERENCE_LIST } from "../constant";

export const useActions = (state: IStateModel, dispatch: Dispatch<any>) => {

  const updatePreference = ( preferenceObject: SearchModel ) => {

    // Create a list of entries that matches the list of accepted preference
    const acceptedPeferences = Object.entries(
      preferenceObject ).filter( ( item ): boolean => ACCEPETED_PREFERENCE_LIST.includes( item[0] ),
    );

    // Save matching peference to local storage
    acceptedPeferences.map( ( item ) => {
        localStorage.setItem( item[0], JSON.stringify(item[1]));
    } );

    // Also add the matching perfernece to dispatch
    const preferenceObjectForDispatch = acceptedPeferences.reduce( ( result, item ) => {
      return {
        ...result,
        [item[0]]: item[1],
      };
    } );

    dispatch( {
        ...preferenceObjectForDispatch,
        type: typeOptions.UPDATE_SEARCH,
      } );
  };

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
          contentType: state.search.contentType,
          history: newHistory,
          page: nextPage,
          safeSearch: state.search.safeSearch,
          text: searchText,
          type: typeOptions.UPDATE_SEARCH,
        } );

      // Start a new search
      } else {
        searchFlickrPhoto( searchText, dispatch, 1, [], {
          contentType: state.search.contentType,
          history: [...oldHistory, searchText ],
          page: 1,
          safeSearch: state.search.safeSearch,
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
    updatePreference,
  };
};
