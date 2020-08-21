import { CheckboxItem } from "shared/components/checkbox-list/checkbox-list";

export interface FormControl<T = any> {
    value: T;
    type: 'text' | 'number' | 'email' | 'checkbox' | 'password' | 'select' | 'checkbox-list';
    label: string;
    id: string;
    required?: boolean;
    minLength?: number;
    invalid?: boolean;
}

export type Formulario = { [P: string]: FormControl };


export const validarValorCampo = (control: FormControl): boolean => {
    switch(control.type) {
        case 'checkbox-list': return !(control.value as CheckboxItem[]).some(item => item.value)
        default: return !control.value
    }
}

/** 
 * Valida um campo baseado no seu tipo.
*/
export const validarCampo = (control: FormControl): boolean => {
    return !!control.required && validarValorCampo(control);
}

/** 
 * Verifica se o formulário é valido 
*/
export const validarFormulario = (form: Formulario): boolean => {
    return Object.values(form).some(control => !control.invalid);
}

/**
 * Gera uma copia do formulário atualizando a validade de cada campo
 */
export const atualizarValidadeFormulario = <F extends Formulario>(form: F): F => {
    const formAtualizado = {...form} as Formulario;
    const keys = Object.keys(form);

    keys.forEach(key => {
        formAtualizado[key] = {
            ...formAtualizado[key],
            invalid: validarCampo(formAtualizado[key])
        }
    });

    return formAtualizado as F;
}

export const valoresFormulario = <F>(form: Formulario): F => {
    const valoresForm: {[p: string]: any} = {...form};
    Object.keys(form).forEach(key => {
        valoresForm[key] =  valoresForm[key].value
    });

    return valoresForm as F;
}
