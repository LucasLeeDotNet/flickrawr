/**
 * Model for the objects created by the actions
 */
export default interface IActionObjectModel {
  children?: JSX.Element;
  hideDuration?: number;
  history?: string[];
  message?: string;
  page?: number;
  pages?: number;
  result?: [];
  text?: string;
  type: string;
}
