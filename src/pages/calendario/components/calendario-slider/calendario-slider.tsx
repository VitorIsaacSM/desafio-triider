import React from 'react';
import styles from './calendario-slider.module.scss';

interface Props {
    diaAtual: Date;
    semanaAtual: number;
}

export const CalendarioSlider: React.FC<Props> = (props) => {



    return (
        <div className={styles.slider}>
            
        </div>
    )
}

export default CalendarioSlider;