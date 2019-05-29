// React
import React, { ChangeEvent, KeyboardEvent, MouseEvent, useContext, useEffect, useState } from "react";

// State
import { StoreContext } from "../../context/StoreContext";

// Material UI
import { Divider, IconButton, InputBase, Paper } from "@material-ui/core";

// Material Icon
import ClearIcon from "@material-ui/icons/Clear";
import MenuIcon from "@material-ui/icons/Menu";
import SearchIcon from "@material-ui/icons/Search";

// Constant
import { INPUT_TIMEOUT } from "../../constant";
import { typeOptions } from "../../context/reducers";


export interface ISearchbarModel {
  sendSearchRef?: ( element: HTMLDivElement ) => void;
  styleSuffix?: string;
  text: string;
}

/**
 * input timeout to auto submit inputs
 * after input has timed out the current search term will be submitted
 */
let inputTimer: NodeJS.Timeout;

const Searchbar = ( props: ISearchbarModel ) => {
  const { actions, dispatch } = useContext( StoreContext );
  const { sendSearchRef, text } = props;
  const styleSuffix = props.styleSuffix || "";

  // Local State
  const [ searchText, updateSearchText ] = useState( text );
  const [ timerFlag, startTimer ] = useState( false );


  /**
   * Fire off the searchFlickr call during the useEffect handler to ensure
   * the interval gets the latest value from searchTexdt
   */
  useEffect( (): void => {
    if ( timerFlag ) {
      inputTimer = setInterval(() => {
          actions.searchFlickr( searchText, false );
          // Clear the interval after the interval has ran
          clearInterval( inputTimer );
        }, INPUT_TIMEOUT );
      // Switch the timerFlag off after the setTimeout has ran
      startTimer( false );
    }
  }, [ timerFlag, searchText ]);


  /**
   * Clear out the current input text
   *
   * @param {MouseEvent<HTMLElement>} event Mouse event Object
   * @returns void
   */
  const handleClearButtonClick = ( event: MouseEvent<HTMLElement>): void => {
    updateSearchText( "" );
  };


  /**
   * Handler for search input value change
   *
   * @param {ChangeEvent<HTMLInputElement>} event Change event Object
   * @returns void
   */
  const handleInputChanged = ( event: ChangeEvent<HTMLInputElement>): void => {
    clearInterval( inputTimer );
    updateSearchText( event.target.value );
    // Set the timer flag to trigger the side effect to run the set timeout with the latest value in searchText
    // Only start timer if the value is non empty
    if ( event.target.value !== "" ) {
      startTimer( true );
    }
  };


  /**
   * Handle enter key press to submit search
   *
   * @param {KeyboardEvent<HTMLInputElement>} event Keyboard event object
   * @returns void
   */
  const handleKeyPress = ( event: KeyboardEvent<HTMLInputElement> ): void => {
      // Submit change when enter pressed and the search term is not empty
      if ( event.key === "Enter" && searchText !== "" ) {
      clearInterval( inputTimer );
      actions.searchFlickr( searchText, true );
    }
  };


  /**
   * Handle search button click
   *
   * @returns void
   */
  const handleSearchButtonClick = (): void => {
    // Make sure the search term is not empty before preforming an action
    if ( searchText !== "" ) {
      clearInterval( inputTimer );
      actions.searchFlickr( searchText, true );
    }
  };


  /**
   * Dispatch a state change to open sidemenu
   *
   * @returns void
   */
  const handleSideMenuClick = (): void => {
      dispatch(
      {
        type: typeOptions.SHOW_SIDEMENU,
      },
    );
  };


  /**
   * Sends the search element reference to the parent callback
   *
   * @param {HTtoMLDivElement} element Element reference to the search bar
   * @returns void
   */
  const setSearchRef = (element: HTMLDivElement): void => {
    if ( typeof sendSearchRef === "function") { sendSearchRef( element ); }
  };


  return(
    <div className={"Searchbar" + styleSuffix} ref={setSearchRef}>
      <Paper className={"Searchbar-paper" + styleSuffix} elevation={1}>
        <IconButton aria-label="Menu" onClick={handleSideMenuClick}>
          <MenuIcon />
        </IconButton>
        <InputBase
          value={searchText}
          onChange={handleInputChanged}
          className={"Searchbar-input" + styleSuffix}
          placeholder="rawrrrr!"
          onKeyDown={handleKeyPress}
        />
        {
          /**
           * Only show the clear button when text is entered
           */
        }
        {
          searchText !== "" ?
            <IconButton
              className="Searchbar-clearButton"
              onClick={handleClearButtonClick}
              aria-label="Clear"
            >
              <ClearIcon/>
            </IconButton>
            :
            undefined
        }

        <Divider/>

        <IconButton
          className={"Searchbar-searchButton" + styleSuffix}
          aria-label="Search"
          onClick={handleSearchButtonClick}
        >
          <SearchIcon/>
        </IconButton>
      </Paper>
    </div>
  );
};

export default Searchbar;
