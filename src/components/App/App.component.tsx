// React
import React, { RefObject, UIEvent, useContext } from "react";

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
let bottomRef: any;
declare var document: any;
const App = () => {

  const { actions, state } = useContext( StoreContext );
  const isLoading: boolean = state.isLoading;
  const isAnimating: boolean = state.isAnimating;
  const text: string = state.search.text;
  const result: IFlickrPhotoModel[] = state.search.result;

  const handleSearchbarInputChange = ( searchText: string ) => {
    // tslint:disable-next-line:no-console
    if ( searchText ) { actions.searchFlickr( searchText, false ); }
  };


  const checkIsHidden = ( ) => {
    const bounding = bottomRef.getBoundingClientRect();
    if (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.right <= (window.innerWidth || document.documentElement.clientWidth) &&
      bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) ) {
        actions.searchFlickr(state.search.text, false );
      }
  };

  const getref = ( ref: any) => {
    bottomRef = ref;
  };

  return (
    <div className="App">
      <Navheader/>
      {isLoading ?
        <div className="App-content-loadingOverlay"/>
      :
      undefined}
      <div className={"App-content" + (isLoading ? " App-content--loading" : "")} onScroll={checkIsHidden} >
        <Searchbar text={text} onChange={handleSearchbarInputChange}/>
        {
          state.search.result.length === 0 ?
          undefined
          :
          <ImagesDisplay sendRef={getref}/>
        }
      </div>
      <Notification/>
    </div>
  );
};

export default App;
