// Models
import { ACCEPETED_PREFERENCE_LIST } from "../constant";
import DrawerModel from "../models/Drawer.model";
import IStateModel from "../models/IState.model";
import NotificationModel from "../models/Notification.model";
import SearchModel from "../models/Search.model";
import SideMenuModel from "../models/SideMenu.model";

const localStoragePreferneces = ACCEPETED_PREFERENCE_LIST.reduce( ( result, item: string ) =>  {
  const localStorageValue = localStorage.getItem( item );
  if ( typeof localStorageValue === "string" ) {
    return {
      ...result,
      [item]:  JSON.parse( localStorageValue ),
    };
  } else {
    return result;
  }
}, {} );

const historyLocalStorageValue = localStorage.getItem( "historia" );
let history = [];
if ( typeof historyLocalStorageValue === "string") {
  history = JSON.parse( historyLocalStorageValue );
}
const newSearch = new SearchModel();
export const initialState: IStateModel = {
  drawer: new DrawerModel(),
  isAnimating: false,
  isLoading: false,
  notification: new NotificationModel(),
  search: { ...newSearch, ...localStoragePreferneces, history: history || newSearch.history},
  sideMenu: new SideMenuModel(),
};
