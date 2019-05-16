// React
import React, { useContext } from "react";

// Context
import { StoreContext } from "../../context/StoreContexst";

// Material UI
import { IconButton, Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

// Model
import { typeOptions } from "../../context/reducers";
import SnackbarModel from "../../models/Snackbar.model";


const SnackbarComponent = () => {
    const { state, dispatch } = useContext( StoreContext );
    const snackbarState: SnackbarModel = state.snackbar;
    const { open, hideDuration, message } = snackbarState;


    /**
     * Close the generic s nackbar
     */
    const handleClose = (): void => {
      dispatch({
        type: typeOptions.HIDE_SNACKBAR,
      });
    };


    return (
      <div>
        <Snackbar
          anchorOrigin={{
            horizontal: "left",
            vertical: "bottom",
          }}
          open={open}
          autoHideDuration={hideDuration}
          onClose={handleClose}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={<span id="message-id">{message}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
};

export default SnackbarComponent;
