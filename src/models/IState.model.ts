/**
 * Model for the global state object
 */
import NotificationModel from "./Notification.model";
import SearchModel from "./Search.model";

export default interface IStateModel {
  isAnimating: boolean;
  isLoading: boolean;
  notification: NotificationModel;
  search: SearchModel;
}
