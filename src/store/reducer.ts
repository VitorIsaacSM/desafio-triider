import { Reducer } from "react";
import { Usuario } from "shared/models/user";
import { Action } from "redux";
import { CustomAction } from "./actions";
import { ActionTypes } from "./actionTypes";
import { act } from "react-dom/test-utils";


export interface GlobalState {
    isLogged: boolean;
    user?: Usuario;
    token?: string;
}

const initialState: GlobalState = {
    isLogged: false
}

export const rootReducer = (state = initialState, action: CustomAction): GlobalState => {    
    switch(action.type) {
        case ActionTypes.LOGIN:
            return {
                ...state,
                user: action.payload?.user,
                token: action.payload?.token,
                isLogged: true
            }
        case ActionTypes.LOGOUT:
            localStorage.clear();
            return {
                isLogged: false,
                user: undefined,
                token: undefined
            }
        default: return state
    }
}