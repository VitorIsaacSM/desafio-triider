import React, { ChangeEvent } from 'react'
import styles from './select.module.scss';
import { FormControl } from 'shared/models/form-control';

export interface SelectOption {
  value: string;
  name: string;
}

interface Props {
  changeHandler?: (event: ChangeEvent<HTMLSelectElement>) => void
  options: SelectOption[];
  control: FormControl
}

export const Select: React.FC<Props> = props => {

  const options = props.options.map(option => <option key={option.value} value={option.value}>{option.name}</option>)
  const classes = [styles.customSelect, props.control.invalid ? styles.invalid : ''];

  return (
    <label htmlFor={props.control.id} className={classes.join(' ')}>
      <span>{props.control.label}</span>
      <select id={props.control.id} value={props.control.value} onChange={props.changeHandler}>
        <option value="">Selecione...</option>
        {options}
      </select>
    </label>
  )
}

export default Select;