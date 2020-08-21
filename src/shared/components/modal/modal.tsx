import React from 'react';
import classes from './modal.module.scss';
import Wrapper from '../wrapper/wrapper';
import Backdrop from '../backdrop/backdrop';

const Modal: React.FunctionComponent<{show: boolean, modalClose: () => void}> = (props) => (
    <Wrapper>
        <div className={`${classes.Modal} ${props.show ? classes.show : ''}`}>
            {props.children}
        </div>
        <Backdrop show={props.show} backdropClick={props.modalClose}/>
    </Wrapper>
)

export default Modal;