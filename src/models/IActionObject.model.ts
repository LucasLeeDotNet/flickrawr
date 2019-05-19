/**
 * Model for the objects created by the actions
 */
export default interface IActionObjectModel {
  type: string;
  hideDuration?: number;
  history?: string[];
  message?: string;
  page?: number;
  text?: string;
  result?: [];
}
