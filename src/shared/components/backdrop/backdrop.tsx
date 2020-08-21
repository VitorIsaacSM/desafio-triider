import React from 'react';
import classes from './backdrop.module.scss'

const Backdrop: React.FunctionComponent<{show: boolean, backdropClick: () => void}> = (props) => (
    props.show ? <div className={classes.Backdrop} onClick={props.backdropClick}></div> : null
);

export default Backdrop;