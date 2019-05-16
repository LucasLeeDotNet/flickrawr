// React
import React from "react";

// Components
import Navheader from "../core/Navheader.component";
import Notification from "../core/Notification.component";

const App = () => {
  return (
    <div>
      <Navheader/>
      <div>
        Flickrawr with typescript!
      </div>
      <Notification/>
    </div>
  );
};

export default App;
