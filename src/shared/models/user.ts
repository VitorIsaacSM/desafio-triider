import { CheckboxItem } from "shared/components/checkbox-list/checkbox-list";

export interface Usuario {
    id: number
    nome: string;
    email: string;
    password: string;
    categoria: string;
    diasSemana: CheckboxItem[];
    turnos: CheckboxItem[];
    preco: string;
}