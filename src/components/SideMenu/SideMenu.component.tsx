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
  const incomingContentType: string  = state.search.contentType;

  // Local state
  const [ safeSearch, setSafeSearch ] = useState( incomingSafeSearch );
  const [ contentType, setContentType ] = useState( incomingContentType );


  /**
   * Handler to close the side menu
   */
  const handleHideSideMenu = (): void => {
      dispatch(
      {
        type: typeOptions.HIDE_SIDEMENU,
      },
    );
  };


  /**
   * Handler to set the contentType
   */
  const handleContentTypeChange = ( event: ChangeEvent<HTMLSelectElement> ): void => {
    setContentType( event.target.value );
  };


  /**
   * Handler to set safeSearch
   */
  const handleSafeSearchChange = ( event: ChangeEvent<HTMLSelectElement> ): void => {
    setSafeSearch( event.target.value );
  };


  /**
   * Handler to save all perfernece
   */
  const handleSavePreference = () => {
    actions.updatePreference( {
      ...search,
      contentType,
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


        {
          /**
           * Safe Search Input
           */
        }
        <FormControl className="SideMenu-safeSearch SideMenu-input">
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
        {
          /**
           * Content Type Input
           */
        }
        <FormControl className="SideMenu-contentType SideMenu-input">
          <InputLabel htmlFor="lastUsed">Content Type</InputLabel>
          <Select
            value={contentType}
            onChange={handleContentTypeChange}
          >
            <MenuItem value="1">For photos only</MenuItem>
            <MenuItem value="2">For screenshots only</MenuItem>
            <MenuItem value="3">For 'other' only</MenuItem>
            <MenuItem value="4">For photos and screenshots</MenuItem>
            <MenuItem value="5">For screenshots and 'other'</MenuItem>
            <MenuItem value="6">For photos and 'other'</MenuItem>
            <MenuItem value="7">For photos, screenshots, and 'other' (all)</MenuItem>
          </Select>
        </FormControl>


        {
          /**
           * Anction buttons
           */
        }
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
