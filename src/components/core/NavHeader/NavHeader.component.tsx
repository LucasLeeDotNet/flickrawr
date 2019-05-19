// React
import React, { useContext } from "react";

// State
import { StoreContext } from "../../../context/StoreContext";

// Material
import { AppBar, LinearProgress, Toolbar, Typography } from "@material-ui/core";
import Searchbar from "../../Searchbar/Searchbar.component";

export interface INavHeader {
  onSearch: ( searchText: string ) => void;
  showSearch: boolean;
}

const NavHeader = ( props: INavHeader ) => {
  const {state} = useContext( StoreContext );
  const isLoading: boolean = state.isLoading;
  const { onSearch, showSearch } = props;
  const text = state.search.text;
  const handleSearchbarInputChange = onSearch;

  return (
    <div className="NavHeader" >
      <AppBar position="static" color="default">
        <Toolbar className="NavHeader-toolbar">
          <img src="./logo.png" width="100" />
          <div className="NavHeader-title">
            {"flick{{rawr!}}"}
            <span className="NavHeader-subtitle">flickr but louder</span>
          </div>
         { showSearch ?
            <Searchbar text={text} onChange={handleSearchbarInputChange} styleSuffix="--forHeader"/>
            :
            undefined
          }
        </Toolbar>
      </AppBar>
      { isLoading ? <LinearProgress />
      :
        undefined
      }
    </div>
  );
};

export default NavHeader;
