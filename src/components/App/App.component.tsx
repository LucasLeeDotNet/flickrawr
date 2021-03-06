// React
import React, { useContext, useState } from "react";

// Material UI
import { Chip, CircularProgress, ListItem } from "@material-ui/core";

// State
import { StoreContext } from "../../context/StoreContext";

// Components
import Navheader from "../core/NavHeader/NavHeader.component";
import Notification from "../core/Notification/Notification.component";
import ImagePreview from "../ImagePreview/ImagePreview.component";
import ImagesDisplay from "../ImagesDisplay/ImagesDisplay.component";
import Searchbar from "../Searchbar/Searchbar.component";

// Models
import FlickrPhotoModel from "../../models/FlickrPhoto.model";
import SideMenu from "../SideMenu/SideMenu.component";

declare const document: any;


const App = () => {

  const { actions, state } = useContext( StoreContext );
  const isLoading: boolean = state.isLoading;
  const text: string = state.search.text;
  const result: FlickrPhotoModel[] = state.search.result;
  const imagePreviewShow: boolean = state.drawer.open;
  const showSideMenu: boolean = state.sideMenu.open;
  const history: string[] = state.search.history;

  // Local State
  const [ bottomRef, setLastImageRef ] = useState();
  const [ showHeaderSearch, setShowHeaderSearch ] = useState( false );
  const [ searchRef, setSearchRef ] = useState();


  /**
   * Remove an item from the history
   *
   * @param {string} searchHistory Name of the search term to be deleted from history
   * @returns void
   */
  const handleDeleteHistory = ( searchHistory: string ): void => {
    actions.deleteHistory( searchHistory );
  };


  /**
   * Search the term when the search term history is clicked
   *
   * @param {string} searchTerm Search term show in the history list
   * @returns void
   */
  const handleHistoryClick = ( searchTerm: string ): void => {
    actions.searchFlickr( searchTerm, true );
  };


  /**
   * Fires on scroll, check if certain elements within the viewport and performs an action
   *
   * @returns void
   */
  const handleVisibilityCheck = (): void => {

    // Checks if the bottom reference is visible, if is visible perform a search for the next page
    if ( bottomRef && checkIsVisible( bottomRef ) ) {
        actions.searchFlickr(state.search.text, false );
      }

    // Check if the search bar is visible, if not visible, show the show the search bar in the nav header
    if ( searchRef && checkIsVisible( searchRef ) ) {
        setShowHeaderSearch( false );
    } else {
        setShowHeaderSearch( true );
    }
  };


  /**
   * Helper function to check if an element is visible in the viewport
   *
   * @param {HTMLElement} element The reference element that is being checked
   * @returns {boolean} The result of checking if an element is in the viewport
   */
  const checkIsVisible = ( element: HTMLElement ): boolean => {
    const bound = element.getBoundingClientRect();
    return bound.top >= 0 &&
      bound.left >= 0 &&
      bound.right <= (window.innerWidth || document.documentElement.clientWidth) &&
      bound.bottom <= (window.innerHeight || document.documentElement.clientHeight);
  };


  return (
    <div className="App">
      <Navheader showSearch={showHeaderSearch}/>

      {
        /**
         * Show the loading overlay when isLoading state is true
         */
      }
      {isLoading ?
        <div className="App-content-loadingOverlay">
          <CircularProgress className="App-progress"/>
        </div>
      :
      undefined}

      {
        /**
         * Apply App-content--loading class to blur content during loading phase
         * This container is the core vertical scroll container, onScroll listener is applied here
         */
      }
      <div
        className={"App-content" +
        (isLoading || imagePreviewShow || showSideMenu ? " App-content--loading" : "")}
        onScroll={handleVisibilityCheck}
      > <div className="App-content-searchbarContainer">
          <Searchbar text={text} sendSearchRef={setSearchRef}/>
          {
            /**
             * Show a list of search term history
             */
          }
          <div className="app-content-historyContainer">
            {
              history.map( ( item: string, index: number ) => {
                return (
                  <Chip
                    className="App-content-history"
                    key={index}
                    label={item}
                    // tslint:disable-next-line:jsx-no-lambda
                    onDelete={() => handleDeleteHistory(item)}
                    // tslint:disable-next-line:jsx-no-lambda
                    onClick={() => handleHistoryClick(item)}
                    variant="outlined"
                  />
                );
              })
            }
          </div>
        </div>
        {
          /**
           * Only show the image display if theres at least one image
           */
          result.length === 0 ?
          undefined
          :
          <ImagesDisplay sendLastImageRef={setLastImageRef}/>
        }
      </div>
      <SideMenu />
      <Notification/>
      <ImagePreview />
    </div>
  );
};

export default App;
