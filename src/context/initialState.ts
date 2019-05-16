// Models
import IStateModel from "../models/IState.model";
import NotificationModel from "../models/Notification.model";

export const initialState: IStateModel = {
  isLoading: false,
  notification: new NotificationModel(),
};
