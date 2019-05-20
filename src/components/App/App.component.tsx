// React
import React, { useContext, useState } from "react";

// Material UI
import { CircularProgress } from "@material-ui/core";

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

declare const document: any;


const App = () => {

  const { actions, state } = useContext( StoreContext );
  const isLoading: boolean = state.isLoading;
  const text: string = state.search.text;
  const result: FlickrPhotoModel[] = state.search.result;
  const imagePreviewShow: boolean = state.drawer.open;

  // Local State
  const [ bottomRef, setLastImageRef ] = useState();
  const [ showHeaderSearch, setShowHeaderSearch ] = useState( false );
  const [ searchRef, setSearchRef ] = useState();


  /**
   * Fires on scroll, check if certain elements within the viewport and performs an action
   */
  const handleVisibilityCheck = () => {
    if ( checkIsVisible( bottomRef ) ) {
        actions.searchFlickr(state.search.text, false );
      }

    if (checkIsVisible( searchRef ) ) {
        setShowHeaderSearch( false );
    } else {
        setShowHeaderSearch( true );
    }
  };


  /**
   * Helper function to check if an element is visible in the viewport
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
        (isLoading || imagePreviewShow ? " App-content--loading" : "")}
        onScroll={handleVisibilityCheck}
      >
        <Searchbar text={text} sendSearchRef={setSearchRef}/>
        {
          result.length === 0 ?
          undefined
          :
          <ImagesDisplay sendLastImageRef={setLastImageRef}/>
        }
      </div>

      <Notification/>
      <ImagePreview />
    </div>
  );
};

export default App;
