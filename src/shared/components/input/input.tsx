import React, { ChangeEvent, useState, useRef, useEffect } from 'react'
import styles from './input.module.scss';
import Inputmask from 'inputmask';
import { FormControl } from 'shared/models/form-control';

interface Props {
    changeHandler?: (event: ChangeEvent<HTMLInputElement>) => void
    currency?: boolean
    control: FormControl;
}

export const Input: React.FC<Props> = props => {

    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        if (props.currency && inputEl && inputEl.current) {
            Inputmask('currency', {rightAlign: false, radixPoint: ',',prefix: 'R$ '}).mask(inputEl.current)
        }
    }, [props.currency]);
    
    const inputEl = useRef<HTMLInputElement>(null);
    const classes = [styles.customInput, props.control.invalid ? styles.invalid : ''];
    
    return (
        <label htmlFor={props.control.id} className={classes.join(' ')}>
            <span>{props.control.label}</span>
            <div>
                <input ref={inputEl} value={props.control.value} minLength={props.control.minLength} type={showPassword ? 'text' : props.control.type} id={props.control.id} onChange={props.changeHandler}/>
                {
                    props.control.type !== 'password' ? null : 
                    <i className={showPassword ? 'far fa-eye' : 'far fa-eye-slash'} onClick={() => setShowPassword(!showPassword)}></i>
                }
            </div>
        </label>
    )
}