/**
 * Model for the objects created by the actions
 */
export default interface IActionObjectModel {
  hideDuration?: number;
  history?: string[];
  message?: string;
  page?: number;
  pages?: number;
  result?: [];
  selectedIndex?: number;
  text?: string;
  total?: number;
  type: string;
}
