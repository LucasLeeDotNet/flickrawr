// State
import { initialState } from "./initialState";

// Models
import IActionObjectModel from "../models/IActionObject.model";
import IStateModel from "../models/IState.model";

// store list of typeOptions
export const typeOptions = {
  HIDE_NOTIFICATION: "HIDE_NOTIFICATION",
  SHOW_NOTIFICATION: "SHOW_NOTIFICATION",
};

const reducers = ( state: IStateModel = initialState, action: IActionObjectModel ): IStateModel => {

  switch ( action.type ) {
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
