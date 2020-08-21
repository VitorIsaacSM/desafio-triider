import React, { Component, Dispatch } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import { Routes } from './shared/models/routes';
import Calendario from './pages/calendario/calendario';
import Autenticacao from 'pages/autenticacao/autenticacao';
import Header from 'shared/components/header/header';
import { connect } from 'react-redux';
import { GlobalState } from 'store/reducer';
import { CustomAction, logOut, setUsuario } from 'store/actions';
import { Usuario } from 'shared/models/user';

interface DispatchToProps {
  logOut: () => void;
  setUser: (user: Usuario, token: string) => void
}

class App extends Component<{isLogged: boolean} & DispatchToProps> {
  
  componentDidMount() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (user && token) {
      this.props.setUser(JSON.parse(user), token);
    }
  }

  render() {
    return (
      <div>
        <BrowserRouter>
          { this.props.isLogged ? <Header clickSair={this.props.logOut}/> : null}
          <Switch>
            <Route path={Routes.Login} component={Autenticacao} />
            {this.props.isLogged ? <Route path={Routes.Calendario} component={Calendario} /> : null}
            <Redirect path="/" to={Routes.Login} />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalState) => {
  return {
    isLogged: state.isLogged
  }
}

const mapDispatchToProps = (dispatch: Dispatch<CustomAction>): DispatchToProps => {
  return {
    logOut: () => dispatch(logOut()),
    setUser: (user, token) => dispatch(setUsuario(user, token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
