// React
import React, { useContext } from "react";

// State
import { typeOptions } from "../../context/reducers";
import { StoreContext } from "../../context/StoreContext";

// Material UI
import { Drawer, Fab, IconButton } from "@material-ui/core";

// Material Icon
import ClearIcon from "@material-ui/icons/Clear";
import BackwardIcon from "@material-ui/icons/KeyboardArrowLeft";
import ForwardIcon from "@material-ui/icons/KeyboardArrowRight";

// Models
import FlickrPhotoModel from "../../models/FlickrPhoto.model";

const ImagePreview = ( ) => {
  const { dispatch, state } = useContext( StoreContext );
  const open: boolean = state.drawer.open;
  const results: FlickrPhotoModel[] = state.search.result;
  const selectedIndex = state.drawer.selectedIndex;
  const image = results[ selectedIndex ];
  const anchor = state.drawer.anchor;


  const handleClosePreview = ( ): void => {
    dispatch( { type: typeOptions.HIDE_DRAWER } );
  };


  const handleLoadPreviousImage = (): void => {
    if ( selectedIndex > 0 ) {
      dispatch(
        {
          selectedIndex: selectedIndex - 1,
          type: typeOptions.SHOW_DRAWER,
        },
      );
    }
  };

  const handleLoadNextImage = (): void => {
    if ( selectedIndex < results.length - 1 ) {
      dispatch(
        {
          selectedIndex: selectedIndex + 1,
          type: typeOptions.SHOW_DRAWER,
        },
      );
    }
  };

  return (
    <Drawer
      className="ImagePreview-drawer"
      anchor={anchor}
      open={open}
      onClose={handleClosePreview}
    >
      <div className="ImagePreview">
        <div
          className="ImagePreview-backNav"
          onClick={handleLoadPreviousImage}
        >
          <IconButton disabled={selectedIndex < 1}  aria-label="Last Image">
            <BackwardIcon />
          </IconButton>
        </div>
        {
          image ?
          <img
            className="ImagePreview-photo"
            alt={image.title}
            src={`https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`}
          />
          :
          undefined
        }
        <div
          className="ImagePreview-forwardNav"
          onClick={handleLoadNextImage}
        >
          <IconButton
            aria-label="Next Image"
            disabled={selectedIndex > results.length - 2}
          >
            <ForwardIcon />
          </IconButton>
        </div>

        <div className="ImagePreview-buttonContainer">
          <Fab aria-label="Close" onClick={handleClosePreview}>
            <ClearIcon />
          </Fab>
        </div>
      </div>
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
