import React from 'react';
import styles from './checkbox-list.module.scss';
import Checkbox from '../checkbox/checkbox';
import { FormControl } from 'shared/models/form-control';

export interface CheckboxItem {
  value: boolean;
  name: string;
}

interface Props {
  control: FormControl<CheckboxItem[]>;
  rounded?: boolean;
  changeHandler: (items: CheckboxItem[]) => void
}

const CheckboxList: React.FC<Props> = (props) => {

  const updatedItems = (value: boolean, index: number): CheckboxItem[] => {
    const newItems = [...props.control.value];
    newItems[index] = {...newItems[index], value};
    return newItems;
  }

  const classes = [styles.checkboxList, props.control.invalid ? styles.invalid : ''];

  const list = props.control.value.map((item, index) => (
    <Checkbox key={item.name}
      value={item.value}
      name={item.name}
      id={item.name + props.control.id}
      rounded={props.rounded} 
      changeHandler={event => props.changeHandler(updatedItems(event.target.checked, index))}/>
  ));

  return (
    <div className={classes.join(' ')}>
      <span>{props.control.label}</span>
      <div>
        {list}
      </div>
    </div>
  );
}

export default CheckboxList;
