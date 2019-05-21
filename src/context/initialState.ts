// Models
import { ACCEPETED_PREFERENCE_LIST } from "../constant";
import DrawerModel from "../models/Drawer.model";
import IStateModel from "../models/IState.model";
import NotificationModel from "../models/Notification.model";
import SearchModel from "../models/Search.model";
import SideMneuModel from "../models/SideMenu.model";

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

export const initialState: IStateModel = {
  drawer: new DrawerModel(),
  isAnimating: false,
  isLoading: false,
  notification: new NotificationModel(),
  search: { ...new SearchModel(), ...localStoragePreferneces  },
  sideMenu: new SideMneuModel(),
};
