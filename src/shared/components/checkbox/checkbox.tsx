import React, { ChangeEvent } from 'react';
import styles from './checkbox.module.scss';

interface Props {
  value: boolean;
  id: string;
  name: string;
  rounded?: boolean
  changeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox: React.FC<Props> = (props) => (
  <label htmlFor={props.id} className={`${styles.checkbox} ${props.value ? styles.ativo : ''} ${props.rounded ? styles.rounded : ''}`} data-testid="checkbox">
    <input type="checkbox" name={props.name} id={props.id} checked={props.value} onChange={props.changeHandler}/>
    <p>{props.rounded ? props.name.charAt(0) : props.name}</p>
  </label>
);

export default Checkbox;
