/**
 * Model for the global state object
 */
import NotificationModel from "./Notification.model";

export default interface IStateModel {
  isLoading: boolean;
  notification: NotificationModel;
}
