import { Usuario } from "shared/models/user";
import { CustomAction } from "./actions";
import { ActionTypes } from "./actionTypes";


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
            }
        default: return state
    }
}