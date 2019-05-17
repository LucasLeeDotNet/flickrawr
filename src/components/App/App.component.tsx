// React
import React, { useContext } from "react";

// Material UI
import { LinearProgress } from "@material-ui/core";

// State
import { StoreContext } from "../../context/StoreContext";

// Components
import Navheader from "../core/Navheader.component";
import Notification from "../core/Notification.component";
import ImagesDisplay from "../ImagesDisplay/ImagesDisplay.component";
import Searchbar from "../Searchbar/Searchbar.component";

// Models
import IFlickrPhotoModel from "../../models/IFlickrPhotoModel";

const App = () => {

  const { actions, state } = useContext( StoreContext );
  const isLoading: boolean = state.isLoading;
  const isAnimating: boolean = state.isAnimating;
  const text: string = state.search.text;
  const result: IFlickrPhotoModel[] = state.search.result;


  const handleSearchbarInputChange = ( searchText: string ) => {
    // tslint:disable-next-line:no-console
    console.log( searchText );
    actions.searchFlickr( searchText );
  };

  return (
    <div className="App">
      <Navheader/>
      { isLoading ? <LinearProgress />
        :
        undefined
      }
      <div className="App-content">
        <Searchbar text={text} onChange={handleSearchbarInputChange}/>
        <ImagesDisplay result={result} isAnimating={isAnimating}/>
      </div>
      <Notification/>
    </div>
  );
};

export default App;
