// React
import React, { ChangeEvent, useContext, useState } from "react";

// Material UI
import { Fab, FormControl, InputLabel, MenuItem, Select, SwipeableDrawer } from "@material-ui/core";

// Material Icon
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

// State
import { typeOptions } from "../../context/reducers";
import { StoreContext } from "../../context/StoreContext";

// Model
import SearchModel from "../../models/Search.model";


const SideMenu = () => {
  const { actions, dispatch, state } = useContext( StoreContext );
  const opened: boolean = state.sideMenu.open;
  const search: SearchModel = state.search;
  const incomingSafeSearch: string  = state.search.safeSearch;

  // Local state
  const [ safeSearch, setSafeSearch ] = useState( incomingSafeSearch );

  const handleHideSideMenu = (): void => {
      dispatch(
      {
        type: typeOptions.HIDE_SIDEMENU,
      },
    );
  };


  const handleSafeSearchChange = ( event: ChangeEvent<HTMLSelectElement> ): void => {
    setSafeSearch( event.target.value );
  };


  const handleSavePreference = () => {
    actions. updatePreference( {
      ...search,
      safeSearch,
    } );
  };


  return (
    <SwipeableDrawer
      className="SideMenu"
      open={opened}
      onClose={handleHideSideMenu}
      onOpen={handleHideSideMenu}
    >
      <div className="SideMenu-Content">
        <div className="SideMenu-title">Search Preference</div>
        <FormControl className="SideMenu-safeSearch">
          <InputLabel htmlFor="lastUsed">Safe Search</InputLabel>
          <Select
            value={safeSearch}
            onChange={handleSafeSearchChange}
          >
            <MenuItem value="1">Safe</MenuItem>
            <MenuItem value="2">Moderate</MenuItem>
            <MenuItem value="3">Restricted</MenuItem>
          </Select>
        </FormControl>

        <div className="SideMenu-buttonsContainer">
          <Fab className="SideMenu-saveButton" aria-label="Save" onClick={handleSavePreference}>
            <CheckIcon />
          </Fab>
          <Fab className="SideMenu-cancelButton" aria-label="Close" onClick={handleHideSideMenu}>
            <ClearIcon />
          </Fab>
        </div>
      </div>
    </SwipeableDrawer>
  );
};

export default SideMenu;
