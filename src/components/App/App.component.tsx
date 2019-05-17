// React
import React, { useContext } from "react";

// Material UI
import { LinearProgress } from "@material-ui/core";

// State
import { StoreContext } from "../../context/StoreContexst";

// Components
import Navheader from "../core/Navheader.component";
import Notification from "../core/Notification.component";
import Searchbar from "../Searchbar/Searchbar.component";


const App = () => {

  const { actions, state } = useContext( StoreContext );
  const isLoading: boolean = state.isLoading;
  const text: string = state.search.text;


  const handleSearchbarInputChange = ( searchText: string ) => {
    actions.searchFlickr( searchText );
  };

  return (
    <div>
      <Navheader/>
      { isLoading ? <LinearProgress />
        :
        undefined
      }
      <div>
        <Searchbar text={text} onChange={handleSearchbarInputChange}/>
      </div>
      <Notification/>
    </div>
  );
};

export default App;
