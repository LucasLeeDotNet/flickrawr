// React
import React, { useContext, useEffect, useState } from "react";

// State
import { StoreContext } from "../../context/StoreContext";

// Material UI
import { Divider, IconButton, InputBase, Paper } from "@material-ui/core";

// Material Icon
import ClearIcon from "@material-ui/icons/Clear";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

export interface ISearchbarModel {
  onChange: ( searchText: string ) => void;
  text: string;
}
let inputTimer: any;

const Searchbar = ( props: ISearchbarModel ) => {
  const { state, actions } = useContext( StoreContext );
  const { onChange, text } = props;
  const [ searchText, updateSearchText ] = useState( text );
  const [ timerFlag, startTimer ] = useState( false );


  useEffect( (): void => {
    if ( timerFlag ) {
      inputTimer = setInterval(() => {
          actions.searchFlickr( searchText );
          // Clear the interval after the interval has ran
          clearInterval( inputTimer );
        }, 1000);
      // Switch the timerFlag off after the setTimeout has ran
      startTimer( false );
    }
  }, [ timerFlag, searchText ]);


  /**
   * Clear out the current input text
   * @param {React.MouseEvent<HTMLElement>} event Event Object
   */
  const handleClearButtonClick = ( event: React.MouseEvent<HTMLElement>): void => {
    updateSearchText( "" );
  };


  /**
   * Handler for input value change
   */
  const handleInputChanged = ( event: React.ChangeEvent<HTMLInputElement>): void => {
    clearInterval( inputTimer );
    updateSearchText( event.target.value );
    // Set the timer flag to trigger the side effect to run the set timeout with the latest value in searchText
    // But only text was enter in the search bar
    if ( event.target.value !== "" ) {
    startTimer( true );
    }
  };


  return(
    <div className="Searchbar">
      <Paper className="Searchbar-paper" elevation={1}>
        <IconButton aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <InputBase
          value={searchText}
          onChange={handleInputChanged}
          className="Searchbar-input"
          placeholder="Search Flickr"
        />
        {
          searchText !== "" ?
            <IconButton className="Searchbar-clearButton" onClick={handleClearButtonClick} aria-label="Clear">
              <ClearIcon/>
            </IconButton>
            :
            undefined
        }
        <Divider/>
        <IconButton className="Searchbar-searchButton" aria-label="Search">
          <SearchIcon/>
        </IconButton>
      </Paper>
    </div>
  );
};

export default Searchbar;
