import Api from "api/api"
import { Endpoints } from "api/endpoints"

export interface Evento {
    id?: number;
    idUsuario: number;
    nome: string;
    local: string;
    data: Date;
    turno: string;
}

export const cadastrarEvento = (evento: Evento) => {
    return Api.post(Endpoints.EVENTOS, evento)
}

export const listarEventos = (idUsuario: number) => {
    return Api.get(Endpoints.EVENTOS, {params: {idUsuario}})
}