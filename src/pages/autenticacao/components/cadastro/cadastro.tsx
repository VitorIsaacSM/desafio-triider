import React, { Component, ChangeEvent, FormEvent, Dispatch } from 'react';
import styles from './cadastro.module.scss';
import { FormControl, Formulario, validarFormulario, atualizarValidadeFormulario, validarCampo, valoresFormulario } from 'shared/models/form-control';
import { Input } from 'shared/components/input/input';
import Select, { SelectOption } from 'shared/components/select/select';
import Checkbox from 'shared/components/checkbox/checkbox';
import CheckboxList, { CheckboxItem } from 'shared/components/checkbox-list/checkbox-list';
import * as service from '../../services/autenticacao.service';
import { Usuario } from 'shared/models/user';
import { connect, DispatchProp } from 'react-redux';
import { setUsuario, CustomAction } from 'store/actions';
import { withRouter, RouteComponentProps, Route } from 'react-router-dom';
import { Endpoints } from 'api/endpoints';
import { Routes } from 'shared/models/routes';

interface DispatchToProps {
  setUser: (user: Usuario, token: string) => void
}

interface Props extends DispatchToProps, RouteComponentProps<any> {
  entrarHandler: () => void;
}

interface FormInicial extends Formulario {
  nome: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
}

interface FormSecundario extends Formulario {
  categoria: FormControl<string>;
  diasSemana: FormControl<CheckboxItem[]>;
  turnos: FormControl<CheckboxItem[]>;
  preco: FormControl<string>;
}

interface State {
  showPage2: boolean;
  formInicial: FormInicial;
  formSecundario: FormSecundario
}

class Cadastro extends Component<Props, State> {

  state: State = {
    showPage2: false,
    formInicial: {
      nome: {
        value: '',
        id: 'nome',
        label: 'Qual o seu nome?',
        type: 'text',
        required: true
      },
      email: {
        value: '',
        id: 'email',
        label: 'E seu e-mail?',
        type: 'email',
        required: true
      },
      password: {
        value: '',
        id: 'password',
        label: 'Crie uma senha',
        type: 'password',
        required: true,
        minLength: 5
      },
    },
    formSecundario: {
      categoria: {
        value: '',
        id: 'categoria',
        label: 'Selecione sua categoria',
        type: 'select',
        required: true
      },
      diasSemana: {
        value: [{
          value: false,
          name: 'Segunda'
        },
        {
          value: false,
          name: 'Terça'
        },
        {
          value: false,
          name: 'Quarta'
        },
        {
          value: false,
          name: 'Quinta'
        },
        {
          value: false,
          name: 'Sexta'
        },
        {
          value: false,
          name: 'Sábado'
        },
        {
          value: false,
          name: 'Domingo'
        }],
        id: 'diasSemana',
        label: 'Selecione os dias da semana que trabalhará',
        required: true,
        type: 'checkbox-list'
      },
      turnos: {
        value: [{
          value: false,
          name: 'Manhã'
        },
        {
          value: false,
          name: 'Tarde'
        },
        {
          value: false,
          name: 'Noite'
        }],
        id: 'turnos',
        label: 'Selecione os turnos que trabalhará',
        required: true,
        type: 'checkbox-list'
      },
      preco: {
        value: '',
        id: 'preco',
        label: 'Informe o preço do seu serviço',
        type: 'text',
        required: true
      },
    }
  }

  categorias = [
    {
      value: 'MALABARISTA',
      name: 'Malabarista'
    },
    {
      value: 'MAGICO',
      name: 'Mágico'
    },
    {
      value: 'PALHACO',
      name: 'Palhaço'
    }
  ]

  changeFormInicialHandler = (value: any, control: FormControl) => {
    const updatedControl: FormControl = { 
      ...control,
      value,
      invalid: control.invalid ? validarCampo(control): false 
    };

    this.setState({
      formInicial: {
        ...this.state.formInicial,
        [control.id]: updatedControl
      }
    })
  }

  changeFormSecundarioHandler = (value: any, control: FormControl) => {
    const updatedControl: FormControl = { 
      ...control,
      value,
      invalid: control.invalid ? !validarCampo(control): false 
    };

    this.setState({
      formSecundario: {
        ...this.state.formSecundario,
        [control.id]: updatedControl
      }
    })
  }

  validarFormInicial = (event: FormEvent) => {
    event.preventDefault();
    const formAtualizado = atualizarValidadeFormulario(this.state.formInicial);
    this.setState({
      showPage2: validarFormulario(formAtualizado),
      formInicial: formAtualizado
    });
  }

  submitForm = (event: FormEvent) => {
    event.preventDefault();
    const formAtualizado = atualizarValidadeFormulario(this.state.formSecundario);

    if (validarFormulario(formAtualizado)) {
      const usuario = {
        ...valoresFormulario<Usuario>(this.state.formInicial),
        ...valoresFormulario<Usuario>(formAtualizado)
      }
      service.cadastrar(usuario)
        .then(res => {
          this.props.setUser(usuario, res.data.accessToken)
          this.props.history.push(Routes.Calendario);
        })
        .catch(err => console.error(err));
    }

    this.setState({formSecundario: formAtualizado});
  }

  get formInicial(): JSX.Element {
    const camposFormularioInicial = Object.values(this.state.formInicial).map(control => (
      <Input control={control} key={control.id} changeHandler={event => this.changeFormInicialHandler(event.target.value, control)} />
    ));

    const formInicial = (
      <div className={styles.content}>
        <form onSubmit={this.validarFormInicial}>
          {camposFormularioInicial}
          <button type="submit">Avançar</button>
        </form>
        <div className={styles.entrar}>
          <p>Já possui uma conta?</p>
          <span className={styles.underline} onClick={this.props.entrarHandler}>Entrar</span>
        </div>
      </div>
    )

    return formInicial;
  }

  get formSecundario(): JSX.Element {
    return (
      <div className={[styles.content, styles.fadeIn].join(' ')}>
        <form onSubmit={this.submitForm}>
          <Select control={this.state.formSecundario.categoria}
            options={this.categorias}
            changeHandler={(event) => this.changeFormSecundarioHandler(event.target.value, this.state.formSecundario.categoria)} />
          <CheckboxList control={this.state.formSecundario.diasSemana} rounded
            changeHandler={(items) => this.changeFormSecundarioHandler(items, this.state.formSecundario.diasSemana)} />
          <CheckboxList control={this.state.formSecundario.turnos}
            changeHandler={(items) => this.changeFormSecundarioHandler(items, this.state.formSecundario.turnos)} />
          <Input control={this.state.formSecundario.preco} currency
            changeHandler={(event) => this.changeFormSecundarioHandler(event.target.value, this.state.formSecundario.preco)} />
          <button type="submit">Criar conta</button>
        </form>

      </div>
    )
  }

  render() {

    return (
      <div className={[styles.cadastro, 'animated'].join(' ')} data-testid="cadastro">
        <h1>
          {this.state.showPage2 ? <i onClick={() => this.setState({showPage2: false})} className="fas fa-arrow-left"></i> : null}
          Criar conta
        </h1>
        {this.state.showPage2 ? this.formSecundario : this.formInicial}
      </div>
    )
  }
};

const mapDispatchToProps = (dispatch: Dispatch<CustomAction>): DispatchToProps => {
  return {
    setUser: (user: Usuario, token: string) => dispatch(setUsuario(user, token))
  }
}

export default withRouter(connect<{}, DispatchToProps>(null, mapDispatchToProps)(Cadastro));
