// State
import { initialState } from "./initialState";

// Models
import IActionObjectModel from "../models/IActionObject.model";
import IStateModel from "../models/IState.model";

// store list of typeOptions
export const typeOptions = {
  FETCHED_PHOTOS: "FETCHED_PHOTOS",
  HIDE_DRAWER: "HIDE_DRAWER",
  HIDE_NOTIFICATION: "HIDE_NOTIFICATION",
  HIDE_SIDEMENU: "HIDE_SIDEMENU",
  IS_ANIMATING: "IS_ANIMATING",
  IS_LOADING: "IS_LOADING",
  IS_NOT_ANIMATING: "IS_NOT_ANIMATING",
  IS_NOT_LOADING: "IS_NOT_LOADING",
  SHOW_DRAWER: "SHOW_DRAWER",
  SHOW_NOTIFICATION: "SHOW_NOTIFICATION",
  SHOW_SIDEMENU: "SHOW_SIDEMENU",
  UPDATE_SEARCH: "UPDATE_SEARCH",
};

const reducers = ( state: IStateModel = initialState, action: IActionObjectModel ): IStateModel => {

  switch ( action.type ) {

    case typeOptions.FETCHED_PHOTOS:
      return {
        ...state,
        isLoading: false,
        notification: {
          ...state.notification,
          hideDuration: action.hideDuration || state.notification.hideDuration,
          message: action.message || state.notification.message,
          open: !!action.message,
        },
        search: {
          ...state.search,
          history: action.history || state.search.history,
          page: action.page || ( action.page === 0 ? 0 : state.search.page ),
          result: action.result || state.search.result,
          text: action.text || state.search.text,
          total: action.total || ( action.total === 0 ? 0 : state.search.total ),
        },
      };


    case typeOptions.HIDE_DRAWER:
      return {
        ...state,
        drawer: {
          ...state.drawer,
          open: false,
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


    case typeOptions.HIDE_SIDEMENU:
      return {
        ...state,
        sideMenu: {
          ...state.sideMenu,
          open: false,
        },
      };


    /**
     * Set app state to is Animating
     */
    case typeOptions.IS_ANIMATING:
      return {
        ...state,
        isAnimating: true,
      };


    /**
     * Set app state to is loading
     */
    case typeOptions.IS_LOADING:
      return {
        ...state,
        isLoading: true,
        notification: {
          ...state.notification,
          hideDuration: action.hideDuration || state.notification.hideDuration,
          message: action.message || state.notification.message,
          open: !!action.message,
        },
        search: {
          ...state.search,
          history: action.history || state.search.history,
          page: action.page || state.search.page,
          text: action.text || state.search.text,
        },
      };


    /**
     * Set app state to is not Animating
     */
    case typeOptions.IS_NOT_ANIMATING:
      return {
        ...state,
        isAnimating: false,
      };


    /**
     * Set app state to is not loading
     */
    case typeOptions.IS_NOT_LOADING:
      return {
        ...state,
        isLoading: false,
        notification: {
          ...state.notification,
          hideDuration: action.hideDuration || state.notification.hideDuration,
          message: action.message || state.notification.message,
          open: !!action.message,
        },
      };


    case typeOptions.SHOW_DRAWER:
      return {
        ...state,
        drawer: {
          ...state.drawer,
          anchor: action.anchor || state.drawer.anchor,
          open: true,
          selectedIndex: action.selectedIndex || ( action.selectedIndex === 0 ? 0 : state.drawer.selectedIndex ),
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


    case typeOptions.SHOW_SIDEMENU:
      return {
        ...state,
        sideMenu: {
          ...state.sideMenu,
          anchor: action.anchor || state.sideMenu.anchor,
          open: true,
        },
      };


    case typeOptions.UPDATE_SEARCH:
      return {
        ...state,
        search: {
          ...state.search,
          history: action.history || state.search.history,
          page: action.page || state.search.page,
          safeSearch: action.safeSearch || state.search.safeSearch,
          text: action.text || state.search.text,
        },
        sideMenu: {
          ...state.sideMenu,
          open: false,
        },
      };


    default: {
      return state;
    }
  }
};

export default reducers;
