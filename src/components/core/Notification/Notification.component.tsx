// React
import React, { useContext } from "react";

// State
import { StoreContext } from "../../../context/StoreContext";

// Material UI
import { IconButton, Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

// Model
import { typeOptions } from "../../../context/reducers";
import NotificationModel from "../../../models/Notification.model";


const Notification = () => {
    const { state, dispatch } = useContext( StoreContext );
    const NotificaitonState: NotificationModel = state.notification;
    const { open, hideDuration, message } = NotificaitonState;


    /**
     * Close the generic snackbar
     */
    const handleClose = (): void => {
      dispatch({
        type: typeOptions.HIDE_NOTIFICATION,
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

export default Notification;
