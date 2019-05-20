// Models
import DrawerModel from "../models/Drawer.model";
import IStateModel from "../models/IState.model";
import NotificationModel from "../models/Notification.model";
import SearchModel from "../models/Search.model";

export const initialState: IStateModel = {
  drawer: new DrawerModel(),
  isAnimating: false,
  isLoading: false,
  notification: new NotificationModel(),
  search: new SearchModel(),
};
