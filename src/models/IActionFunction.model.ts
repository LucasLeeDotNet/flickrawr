import SearchModel from "./Search.model";

/**
 * Model for the action functions
 */
export default interface IActionFunctionModel {
  searchFlickr: ( searchText?: string, newSearchFlag?: boolean ) => void;
  updatePreference: ( searchPreference: SearchModel) => void;
}
