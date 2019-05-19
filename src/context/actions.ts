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
    if ( !state.isLoading) {
      const oldHistory = state.search.history;
      const newHistory = oldHistory.includes( searchText ) ? oldHistory : [...oldHistory, searchText ];

      if ( state.search.text === searchText && !newSearchFlag ) {
        const nextPage = state.search.page + 1;
        // tslint:disable-next-line:no-console
        console.log( state.search.result );
        searchFlickrPhoto( searchText, dispatch, nextPage, state.search.result, {
          history: newHistory,
          page: nextPage,
          text: searchText,
          type: typeOptions.UPDATE_SEARCH,
        } );

      } else {
        searchFlickrPhoto( searchText, dispatch, 1, [], {
          history: [...oldHistory, searchText ],
          page: 1,
          text: searchText,
          type: typeOptions.UPDATE_SEARCH,
        } );
      }
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
