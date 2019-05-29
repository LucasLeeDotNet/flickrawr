/**
 * Model for the global state object
 */
import DrawerModel from "./Drawer.model";
import NotificationModel from "./Notification.model";
import SearchModel from "./Search.model";
import SideMenuModel from "./SideMenu.model";

export default interface IStateModel {
  drawer: DrawerModel;
  isAnimating: boolean;
  isLoading: boolean;
  notification: NotificationModel;
  search: SearchModel;
  sideMenu: SideMenuModel;
}
