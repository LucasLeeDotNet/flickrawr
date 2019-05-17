// State
import { initialState } from "./initialState";

// Models
import IActionObjectModel from "../models/IActionObject.model";
import IStateModel from "../models/IState.model";

// store list of typeOptions
export const typeOptions = {
  HIDE_NOTIFICATION: "HIDE_NOTIFICATION",
  IS_LOADING: "IS_LOADING",
  IS_NOT_LOADING: "IS_NOT_LOADING",
  SHOW_NOTIFICATION: "SHOW_NOTIFICATION",
  UPDATE_SEARCH: "UPDATE_SEARCH",
};

const reducers = ( state: IStateModel = initialState, action: IActionObjectModel ): IStateModel => {

  switch ( action.type ) {

    case typeOptions.UPDATE_SEARCH:
      return {
        ...state,
        search: {
          ...state.search,
          text: action.text || state.search.text,
        },
      };


    /**
     * Hide the generic notification
     */
    case typeOptions.HIDE_NOTIFICATION:
      return {
        ...state,
        notification: {
          ...state.notification,
          open: false,
        },
      };


    /**
     * Set app state to is loading
     */
    case typeOptions.IS_LOADING:
      return {
        ...state,
        isLoading: true,
      };


    /**
     * Set app state to is not loading
     */
    case typeOptions.IS_NOT_LOADING:
      return {
        ...state,
        isLoading: false,
      };


    /**
     * Show the generic notification
     */
    case typeOptions.SHOW_NOTIFICATION:
      return {
        ...state,
        notification: {
          ...state.notification,
          hideDuration: action.hideDuration || state.notification.hideDuration,
          message: action.message || state.notification.message,
          open: true,
        },
      };

    default: {
      return state;
    }
  }
};

export default reducers;
