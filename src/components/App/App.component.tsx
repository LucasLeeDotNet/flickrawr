// React
import React, { RefObject, UIEvent, useContext, useState } from "react";

// Material UI
import { CircularProgress } from "@material-ui/core";

// State
import { StoreContext } from "../../context/StoreContext";

// Components
import Navheader from "../core/NavHeader/NavHeader.component";
import Notification from "../core/Notification/Notification.component";
import ImagesDisplay from "../ImagesDisplay/ImagesDisplay.component";
import Searchbar from "../Searchbar/Searchbar.component";

// Models
import IFlickrPhotoModel from "../../models/IFlickrPhotoModel";

declare const document: any;


const App = () => {

  const { actions, state } = useContext( StoreContext );
  const isLoading: boolean = state.isLoading;
  const text: string = state.search.text;
  const result: IFlickrPhotoModel[] = state.search.result;

  // Local State
  const [ bottomRef, setBottomRef ] = useState();
  const [ showHeaderSearch, setShowHeaderSearch ] = useState( false );
  const [ searchRef, setSearchRef ] = useState();

  const handleSearchbarInputChange = ( searchText: string ) => {
    if ( searchText ) { actions.searchFlickr( searchText, false ); }
  };

  const checkIsVisible = () => {
    const bounding = bottomRef.getBoundingClientRect();
    const searchBounds = searchRef.getBoundingClientRect();

    if (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) ) {
        actions.searchFlickr(state.search.text, false );
      }

    if (
      searchBounds.top >= 0 &&
      searchBounds.left >= 0 &&
      searchBounds.right <= (window.innerWidth || document.documentElement.clientWidth) &&
      searchBounds.bottom <= (window.innerHeight || document.documentElement.clientHeight) ) {
        setShowHeaderSearch( false );
    } else {
        setShowHeaderSearch( true );
    }
  };

  return (
    <div className="App">
      <Navheader showSearch={showHeaderSearch} onSearch={handleSearchbarInputChange}/>
      {isLoading ?
        <div className="App-content-loadingOverlay">
          <CircularProgress className="App-progress"/>
        </div>
      :
      undefined}
      <div className={"App-content" + (isLoading ? " App-content--loading" : "")} onScroll={checkIsVisible} >
        <Searchbar text={text} onChange={handleSearchbarInputChange} sendSearchRef={setSearchRef}/>
        {
          result.length === 0 ?
          undefined
          :
          <ImagesDisplay sendRef={setBottomRef}/>
        }
      </div>
      <Notification/>
    </div>
  );
};

export default App;
