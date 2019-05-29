/**
 * Model for configuring a generic drawer (Drawer is a material ui component)
 */
export default class  DrawerModel {
  public anchor: "bottom" | "top" | "left" | "right" = "bottom";
  public open: boolean = false;
  public selectedIndex: number = -1;
}
