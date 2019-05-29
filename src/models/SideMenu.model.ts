/**
 * Model for configuring a side menu drawer (Drawer is a material ui component)
 */
export default class SideMenuModel {
  public anchor: "bottom" | "top" | "left" | "right" = "bottom";
  public open: boolean = false;
}
