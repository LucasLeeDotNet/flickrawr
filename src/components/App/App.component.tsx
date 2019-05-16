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

  const { state } = useContext( StoreContext );
  const isLoading: boolean = state.isLoading;

  return (
    <div>
      <Navheader/>
      { isLoading ? <LinearProgress />
        :
        undefined
      }
      <div>
        <Searchbar/>
      </div>
      <Notification/>
    </div>
  );
};

export default App;
