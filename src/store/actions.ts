import { Usuario } from "shared/models/user"
import { Action } from "redux"
import { ActionTypes } from "./actionTypes"

export interface CustomAction extends Action<ActionTypes>{
    payload?: {
        user?: Usuario,
        token?: string,
    }
}

export const setUsuario = (user: Usuario, token: string): CustomAction => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    return {
        type: ActionTypes.LOGIN,
        payload: {
            user,
            token,
        }
    }
}

export const logOut = (): CustomAction => {
    return {
        type: ActionTypes.LOGOUT
    }
}