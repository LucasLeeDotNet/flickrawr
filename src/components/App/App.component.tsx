// React
import React from "react";

// Components
import Navheader from "../core/Navheader.component";
import Notification from "../core/Notification.component";
import Searchbar from "../Searchbar/Searchbar.component";

const App = () => {
  return (
    <div>
      <Navheader/>
      <div>
        <Searchbar/>
      </div>
      <Notification/>
    </div>
  );
};

export default App;
