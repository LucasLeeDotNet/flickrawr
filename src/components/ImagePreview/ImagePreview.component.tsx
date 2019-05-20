// React
import React, { useContext } from "react";

// State
import { typeOptions } from "../../context/reducers";
import { StoreContext } from "../../context/StoreContext";

// Material UI
import { Drawer, IconButton } from "@material-ui/core";

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


  const handleClosePreview = ( ): void => {
    dispatch( { type: typeOptions.HIDE_DRAWER } );
  };


  const handleLoadPreviousImage = (): void => {
      dispatch(
      {
        selectedIndex: selectedIndex - 1,
        type: typeOptions.SHOW_DRAWER,
      },
    );
  };

  const handleLoadNextImage = (): void => {
      dispatch(
      {
        selectedIndex: selectedIndex + 1,
        type: typeOptions.SHOW_DRAWER,
      },
    );
  };

  return (
    <Drawer
      className="ImagePreview-drawer"
      anchor="bottom"
      open={open}
      onClose={handleClosePreview}
    >
      <div className="ImagePreview">
        <div className="ImagePreview-backNav" onClick={handleLoadPreviousImage}>
          <IconButton aria-label="Delete" disabled={selectedIndex < 1}>
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
        <div className="ImagePreview-forwardNav" onClick={handleLoadNextImage}>
          <IconButton aria-label="Delete" disabled={selectedIndex > results.length - 1}>
            <ForwardIcon />
          </IconButton>
        </div>

        <div className="ImagePreview-buttonContainer">
          <IconButton aria-label="Delete" onClick={handleClosePreview}>
            <ClearIcon />
          </IconButton>
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
