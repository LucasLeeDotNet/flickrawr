// State
import { initialState } from "./initialState";

// Models
import IActionObjectModel from "../models/IActionObject.model";
import IStateModel from "../models/IState.model";

// store list of typeOptions
export const typeOptions = {
  HIDE_SNACKBAR: "HIDE_SNACKBAR",
  SHOW_SNACKBAR: "SHOW_SNACKBAR",
};

const reducers = ( state: IStateModel = initialState, action: IActionObjectModel ): IStateModel => {

  switch ( action.type ) {
    /**
     * Hide the generic snackbar
     */
    case typeOptions.HIDE_SNACKBAR:
      return {
        ...state,
        snackbar: {
          ...state.snackbar,
          open: false,
        },
      };

      /**
       * Show the generic snackbar
       */
    case typeOptions.SHOW_SNACKBAR:
      return {
        ...state,
        snackbar: {
          ...state.snackbar,
          hideDuration: action.hideDuration || state.snackbar.hideDuration,
          message: action.message || state.snackbar.message,
          open: true,
        },
      };

    default: {
      return state;
    }
  }
};

export default reducers;
