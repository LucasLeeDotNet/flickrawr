/**
 * Model for the objects created by the actions
 */
export default interface IActionObjectModel {
  anchor?: "bottom" | "top" | "left" | "right";
  hideDuration?: number;
  history?: string[];
  message?: string;
  page?: number;
  pages?: number;
  result?: [];
  safeSearch?: string;
  selectedIndex?: number;
  text?: string;
  total?: number;
  type: string;
}
