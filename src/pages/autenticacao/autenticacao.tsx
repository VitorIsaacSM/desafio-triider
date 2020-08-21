import React, { Component, Dispatch } from 'react';
import styles from './autenticacao.module.scss';
import { connect } from 'react-redux';
import Inicio from './components/inicio/inicio';
import Login from './components/login/login';
import Cadastro from './components/cadastro/cadastro';
import { CSSTransition } from 'react-transition-group';
import { CustomAction, logOut } from 'store/actions';

interface State {
  telaAtiva: 'inicio' | 'login' | 'cadastro'
}

interface DispatchToProps {
  logOut: () => void
}

class Autenticacao extends Component<DispatchToProps, State> {

  state: State = {
    telaAtiva: 'inicio'
  }

  componentDidMount() {
    console.log('entrei no login')
    this.props.logOut();
  }

  onCriarConta = () =>  {
    this.setState({telaAtiva: 'cadastro'});
  }

  onEntrar = () => {
    this.setState({telaAtiva: 'login'});
  }

  selectTela(): JSX.Element {
    switch (this.state.telaAtiva) {
      case 'login':
        return <Login criarContaHandler={this.onCriarConta}/>
      case 'cadastro':
        return <Cadastro entrarHandler={this.onEntrar}/>
      default:
        return <Inicio criarContaHandler={this.onCriarConta} entrarHandler={this.onEntrar}/>;
    }
  }

  render() {
    // const telaAtual = this.selectTela();

    return (
      <div className={styles.autenticacao} data-testid="auth">
        <CSSTransition unmountOnExit timeout={500} in={this.state.telaAtiva === 'login'}>
          <Login criarContaHandler={this.onCriarConta}/>
        </CSSTransition>
        <CSSTransition unmountOnExit timeout={500} in={this.state.telaAtiva === 'cadastro'}>
          <Cadastro entrarHandler={this.onEntrar}/>
        </CSSTransition>
        <CSSTransition unmountOnExit timeout={500} in={this.state.telaAtiva === 'inicio'}>
          <Inicio criarContaHandler={this.onCriarConta} entrarHandler={this.onEntrar}/>
        </CSSTransition>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch<CustomAction>) => {
  return {
    logOut: () => dispatch(logOut())
  }
}

export default connect<DispatchToProps>(null, mapDispatchToProps)(Autenticacao);
