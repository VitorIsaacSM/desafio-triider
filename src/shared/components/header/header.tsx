import React from 'react';
import styles from './header.module.scss';


const Header: React.FC<{clickSair: () => void}> = (props) => (
  <div className={styles.header} data-testid="header">
    <i onClick={props.clickSair} className="fas fa-sign-out-alt"></i>
  </div>
);

export default Header;
