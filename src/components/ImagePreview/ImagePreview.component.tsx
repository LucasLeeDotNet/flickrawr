// React
import React, { useState } from "react";

// Material UI

import { Drawer } from "@material-ui/core";

const ImagePreview = () => {
  const [ openedState, setOpenedState ] = useState( false );


  const handleClosePreview = (): void => { 
    setOpenedState( false );
  };

  return (
    <Drawer
      anchor="bottom"
      open={openedState}
      onClose={handleClosePreview}
    >
      <div
        tabIndex={0}
        role="button"
        onClick={handleClosePreview}
        onKeyDown={handleClosePreview}
      >
        {fullList}
      </div>
    </Drawer>
  );
};

export default ImagePreview;
