/**
 * Model for the action functions
 */
export default interface IActionFunctionModel {
  searchFlickr: ( searchText?: string, newSearchFlag?: boolean ) => void;
}
