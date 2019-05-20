// React
import React, { useContext } from "react";

// State
import { StoreContext } from "../../context/StoreContext";
import { typeOptions } from "../../context/reducers";

// Material UI
import { Drawer } from "@material-ui/core";


// interface IImagePreview {
//   children: JSX.Element;
// }

const ImagePreview = ( ) => {
  const { dispatch, state } = useContext( StoreContext );
  const open: boolean = state.drawer.open;
  const children: JSX.Element | undefined = state.drawer.children;

  const handleClosePreview = ( ): void => {
    dispatch( { type: typeOptions.HIDE_DRAWER } );
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleClosePreview}
    >
      {children}
      <div
        tabIndex={0}
        role="button"
        onClick={handleClosePreview}
        onKeyDown={handleClosePreview}
      />
    </Drawer>
  );
};

export default ImagePreview;
