import SearchModel from "./Search.model";

/**
 * Model for the action functions
 */
export default interface IActionFunctionModel {
  deleteHistory: ( searchHistory: string ) => void;
  searchFlickr: ( searchText?: string, newSearchFlag?: boolean ) => void;
  updatePreference: ( searchPreference: SearchModel) => void;
}
