import React, { Component } from 'react';
import styles from './calendario.module.scss';

interface State {
  diaAtual: Date
}

class Calendario extends Component<{}, State> {

  state: State = {
    diaAtual: new Date()
  }

  componentDidMount() {
    console.log(this.props)
  }

  render() {
    return  (
      <div className={styles.calendario} data-testid="calendario">
        calendario Component
      </div>
    )
  }
}

export default Calendario;
