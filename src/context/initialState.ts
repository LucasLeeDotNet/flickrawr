// Models
import IStateModel from "../models/IState.model";
import NotificationModel from "../models/Notification.model";
import SearchModel from "../models/Search.model";

export const initialState: IStateModel = {
  isAnimating: false,
  isLoading: false,
  notification: new NotificationModel(),
  search: new SearchModel(),
};
