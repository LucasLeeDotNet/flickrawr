// React
import { Dispatch } from "react";

// Models
import IStateModel from "../models/IState.model";

export const useActions = (state: IStateModel, dispatch: Dispatch<any>) => {

    // tslint:disable-next-line:no-empty
    const action1 = (param1: string): void => {};

    return {
        action1,
    };
};
