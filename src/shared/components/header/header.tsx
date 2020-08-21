import React from 'react';
import styles from './header.module.scss';


const Header: React.FC<{clickSair: () => void}> = (props) => (
  <div className={styles.header} data-testid="header">
    <div onClick={props.clickSair}>
      Sair
      <i className="fas fa-sign-out-alt"></i>
    </div>
  </div>
);

export default Header;
