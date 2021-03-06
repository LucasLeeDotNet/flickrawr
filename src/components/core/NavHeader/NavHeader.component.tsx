// React
import React, { useContext } from "react";

// State
import { StoreContext } from "../../../context/StoreContext";

// Material
import { AppBar, LinearProgress, Toolbar, Typography } from "@material-ui/core";

// Components
import Searchbar from "../../Searchbar/Searchbar.component";

// COnstant
import { APP_NAME, SLOGAN } from "../../../constant";

export interface INavHeader {
  showSearch: boolean;
}

const NavHeader = ( props: INavHeader ) => {
  const { state } = useContext( StoreContext );
  const { showSearch } = props;
  const isLoading: boolean = state.isLoading;
  const text: string = state.search.text;
  const imagePreviewShow: boolean = state.drawer.open;

  return (
    <div className="NavHeader" >
      <AppBar position="static" color="default">
        <Toolbar className="NavHeader-toolbar">
          <img className="NavHeader-logo" src="./logo.png"/>
          {
            /**
             * show the searchbar if showSearch flag is set to true and it is not currently showing an image preview
             */
          }
          <div className={"NavHeader-title" + ( showSearch && !imagePreviewShow ? " NavHeader-title--showSearch" : "")}>
            {APP_NAME}
            {
              /**
               * Hide the subtitle when the showSearch flag is true
               */
            }
            <span
              className={"NavHeader-subtitle" + ( showSearch ? " NavHeader-subtitle--showSearch" : "")}
            >
            {SLOGAN}
            </span>
          </div>

          {
            /**
             * Only show search bar if the content searchbar is outside the viewport
             */
          }
          { showSearch && !imagePreviewShow ?
            <Searchbar text={text} styleSuffix="--forHeader"/>
            :
            undefined
          }

        </Toolbar>
      </AppBar>
      {
        /**
         * Show loading progress when isLoading is set to true in the global state
         */
      }
      { isLoading ? <LinearProgress />
      :
        undefined
      }
    </div>
  );
};

export default NavHeader;
