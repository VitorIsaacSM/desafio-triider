import React from 'react';
import styles from './inicio.module.scss';
import balaoIcon from 'assets/icons/balao.svg';
import cornetaIcon from 'assets/icons/corneta.svg';


interface Props {
  criarContaHandler: () => void;
  entrarHandler: () => void
}

const Inicio: React.FC<Props> = (props) => (
  <div className={[styles.inicio, 'animated'].join(' ')} data-testid="inicio">
    <div className={styles.container}>
      <h2>Gerenciador de eventos para animadores de festas</h2>
      <div className={styles.btnContainer}>
        <button className={styles.cadastro} onClick={props.criarContaHandler}>Criar conta</button>
        <button className={styles.entrar} onClick={props.entrarHandler}>Entrar</button>
      </div>

      <div className={styles.cards}>
        <div className={styles.card}>
          <img src={balaoIcon} />
          <p>Cadastre suas festas e organize sua agenda!</p>
        </div>
        <div className={styles.card}>
          <img src={cornetaIcon} />
          <p>Informe sua disponibilidade de dias e horários e crie um calendário personalizado</p>
        </div>
      </div>

    </div>
    <p>Desafio Front end Triider</p>
  </div>
);

export default Inicio;
