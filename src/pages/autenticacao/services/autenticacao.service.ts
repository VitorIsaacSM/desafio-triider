import Api from "../../../api/api"
import { Endpoints } from "../../../api/endpoints"
import { Usuario } from "../../../shared/models/user";

// é preciso passar a senha como 'password' para o json-server-auth

export const login = (email: string, senha: string) => {
    return Api.post<{accessToken: string}>(Endpoints.AUTENTICACAO, {email, password: senha});
}

export const buscarUsuario = (idUsuario: number | string) => {
    return Api.get<Usuario>(`${Endpoints.USUARIO}/${idUsuario}`);
}

export const cadastrar = (usuario: Usuario) => {
    return Api.post<{accessToken: string}>(Endpoints.CADASTRO, usuario);
}

export const setUserLocalStorage = (user: Usuario) => {
    localStorage.setItem('user', JSON.stringify(user));
}

export const getUserLocalStorage = (): Usuario => {
    return JSON.parse(localStorage.getItem('user') || '');
}