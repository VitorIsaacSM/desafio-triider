import React, { Component, ChangeEvent, FormEvent, Dispatch } from 'react';
import styles from './login.module.scss';
import { Input } from 'shared/components/input/input';
import { FormControl, validarCampo, atualizarValidadeFormulario, validarFormulario } from 'shared/models/form-control';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Usuario } from 'shared/models/user';
import { CustomAction, setUsuario } from 'store/actions';
import * as service from '../../services/autenticacao.service';
import { JWT } from 'shared/utils/jwt';
import { Routes } from 'shared/models/routes';

interface State {
  form: {
    email: FormControl,
    password: FormControl
  },
  loginIncorreto: boolean
}

interface DispatchToProps {
  setUser: (user: Usuario, token: string) => void
}

interface Props {
  criarContaHandler: () => void
}

class Login extends Component<Props & DispatchToProps & RouteComponentProps, State> {

  state: State = {
    form: {
      email: {
        value: '',
        label: 'E-mail',
        type: 'email',
        id: 'email',
        required: true
      },
      password: {
        value: '',
        label: 'Senha',
        type: 'password',
        id: 'password',
        required: true
      }
    },
    loginIncorreto: false
  }

  changeFormHandler = (event: ChangeEvent<HTMLInputElement>, control: FormControl) => {
    const updatedControl: FormControl = { 
      ...control,
      value: event.target.value,
      invalid: control.invalid ? validarCampo(control): false 
    };

    this.setState({
      form: {
        ...this.state.form,
        [control.id]: updatedControl
      }
    });
  }

  submitHandler = (event: FormEvent) => {

    event.preventDefault();
    const formAtualizado = atualizarValidadeFormulario(this.state.form);

    if (validarFormulario(formAtualizado)) {
      service.login(formAtualizado.email.value, formAtualizado.password.value)
        .then(res => {
          localStorage.setItem('token', res.data.accessToken);
          const idUsuario = JWT.decode<{sub: string}>(res.data.accessToken).sub;
          return service.buscarUsuario(idUsuario);
        }).then(res => {
          localStorage.setItem('user', JSON.stringify(res.data));
          this.props.setUser(res.data, localStorage.getItem('token') || '');
          this.props.history.push(Routes.Calendario);
        }).catch(err => this.setState({loginIncorreto: true}))
    }
    this.setState({form: formAtualizado});
  }

  render() {
    return (
      <div className={[styles.login, 'animated'].join(' ')} data-testid="login">
        <h1>Entrar</h1>
        <div className={styles.content}>
          <form onSubmit={this.submitHandler}>
            <Input control={this.state.form.email} changeHandler={event => this.changeFormHandler(event, this.state.form.email)}/>
            <Input control={this.state.form.password} changeHandler={event => this.changeFormHandler(event, this.state.form.password)}/>
            {this.state.loginIncorreto ? <p className={styles.invalidText}>E-mail ou Senha inválidos</p> : null}
            <div>
              <button type="submit">Entrar</button>
              <p>Esqueci minha senha</p>
            </div>
          </form>
          <div className={styles.criarConta}>
            <p>Não possui uma conta?</p>
            <span className={styles.underline} onClick={this.props.criarContaHandler}>Criar conta</span>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<CustomAction>): DispatchToProps => {
  return {
    setUser: (user: Usuario, token: string) => dispatch(setUsuario(user, token)),
  }
}

export default withRouter(connect<{}, DispatchToProps>(null, mapDispatchToProps)(Login));
