// Models
import IStateModel from "../models/IState.model";
import SnackbarModel from "../models/Snackbar.model";

export const initialState: IStateModel = {
  snackbar: new SnackbarModel(),
};
