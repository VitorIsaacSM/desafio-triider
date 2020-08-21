import React, { Component, FormEvent } from 'react';
import styles from './calendario.module.scss';
import { MESES_ANO } from 'shared/utils/meses';
import Modal from 'shared/components/modal/modal';
import { FormControl, validarCampo, atualizarValidadeFormulario, validarFormulario, resetarValoresFormulario } from 'shared/models/form-control';
import { Input } from 'shared/components/input/input';
import Select, { SelectOption } from 'shared/components/select/select';
import { GlobalState } from 'store/reducer';
import { Usuario } from 'shared/models/user';
import { connect } from 'react-redux';
import * as service from './services/evento.service';
import { Evento } from './services/evento.service';
import CalendarioSlider from './components/calendario-slider/calendario-slider';
import { CheckboxItem } from 'shared/components/checkbox-list/checkbox-list';
import { compareDates } from 'shared/utils/dates';

interface State {
  diaAtual: Date;
  semanaAtual: Date;
  showModalEvento: boolean;
  formEvento: {
    nome: FormControl;
    local: FormControl<string>;
    data: FormControl<string>;
    turno: FormControl;
  },
  eventos: Evento[];
}

const dataAtual = new Date();

class Calendario extends Component<{usuario: Usuario | undefined}, State> {

  state: State = {
    diaAtual: dataAtual,
    semanaAtual: this.getPrimeiroDiaSemana(dataAtual),
    showModalEvento: false,
    formEvento: {
      nome: {
        value: '',
        id: 'nome',
        label: 'Nome do evento',
        type: 'text',
        required: true
      },
      local: {
        value: '',
        id: 'local',
        label: 'Local',
        type: 'text',
        required: true
      },
      data: {
        value: '',
        id: 'data',
        label: 'Data',
        type: 'date',
        required: true
      },
      turno: {
        value: '',
        id: 'turno',
        label: 'Turno',
        type: 'select',
        required: true
      }
    },
    eventos: []
  }

  diasSemana: CheckboxItem[] = [];
  turnos: CheckboxItem[] = [];
  turnosDisponiveisSelecao: SelectOption[] = [];

  componentDidMount() {
    this.turnos = this.props.usuario?.turnos as CheckboxItem[];
    this.turnosDisponiveisSelecao = this.turnos.filter(t => t.value).map((t) => ({name: t.name, value: t.name}));
    this.diasSemana = this.props.usuario?.diasSemana as CheckboxItem[];
    service.listarEventos((this.props.usuario as Usuario).id)
      .then(res => this.setState({eventos: res.data}))

      window.addEventListener('resize', () => {
        const newDataAtual = new Date();
        this.setState({
          diaAtual: newDataAtual,
          semanaAtual: this.getPrimeiroDiaSemana(newDataAtual),
        })
      });
  }

  getPrimeiroDiaSemana(date: Date) {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() - date.getDay())
    return newDate
  }

  alterarDiaAtual = (numDias: number) => {
    const novoDataAtual = new Date(this.state.diaAtual);
    novoDataAtual.setUTCDate(novoDataAtual.getUTCDate() + numDias);
    const novoDiaInicioSemana = new Date(this.state.semanaAtual);
    novoDiaInicioSemana.setDate(novoDiaInicioSemana.getDate() + numDias);

    this.setState({
      diaAtual: novoDataAtual,
      semanaAtual: novoDiaInicioSemana
    })
  }

  formChangeHandler = (valor: any, control: FormControl) => {
    const updatedControl: FormControl = { 
      ...control,
      value: valor,
      invalid: control.invalid ? validarCampo(control): false 
    };

    this.setState({
      formEvento: {
        ...this.state.formEvento,
        [control.id]: updatedControl
      }
    });
  }

  submitHandler = (event: FormEvent) => {
    event.preventDefault();
    const formAtualizado = atualizarValidadeFormulario(this.state.formEvento);

    if (validarFormulario(formAtualizado)) {
      const user = this.props.usuario as Usuario;
      const evento: Evento = {
        idUsuario: user.id,
        data: new Date(formAtualizado.data.value),
        local: formAtualizado.local.value,
        nome: formAtualizado.nome.value,
        turno: formAtualizado.turno.value
      }
      service.cadastrarEvento(evento)
        .then(res => {
          evento.id = res.data.id

          // const diferencaDias = evento.data.getDate() - this.state.diaAtual.getDate();
          // const semanaAtual = new Date(this.state.semanaAtual);
          // semanaAtual.setDate(semanaAtual.getDate() + diferencaDias);

          this.setState({
            eventos: [...this.state.eventos, evento],
            showModalEvento: false,
            // diaAtual: evento.data,
            // semanaAtual
          });
        });
    }
    this.setState({formEvento: formAtualizado});
  }

  openModal = () =>  {
    this.setState({showModalEvento: true, formEvento: resetarValoresFormulario(this.state.formEvento)});
  }

  closeModal = () =>  {
    this.setState({showModalEvento: false});
  }

  verificarEventoAgendado = (dia: Date, turno: string) => {
    return this.state.eventos.find(e => {
      return  compareDates(new Date(e.data), dia) &&  e.turno === turno
    });
  }

  render() {
    return  (
      <div className={styles.calendario} data-testid="calendario">
        <div className={styles.spacing}>
          <h2>{this.state.diaAtual.getUTCDate()} de {MESES_ANO[this.state.diaAtual.getUTCMonth()]}</h2>
        </div>
        <div className={styles.headerPc}>
          <h1>{MESES_ANO[this.state.diaAtual.getUTCMonth()]}</h1>
          <button onClick={this.openModal}>Novo evento</button>
        </div>
        <div className={styles.sliderDiv}>
          <CalendarioSlider 
              diaAtual={this.state.diaAtual}
              semanaAtual={this.state.semanaAtual}
              turnos={this.turnos}
              diasSemana={this.diasSemana}
              verificarEventoAgendado={this.verificarEventoAgendado}
              modificarDia={this.alterarDiaAtual}/>
        </div>
        <div className={styles.spacing}>
          <button onClick={this.openModal} className={styles.addEvento}>  
            Novo Evento
          </button>
        </div>
        <Modal show={this.state.showModalEvento} modalClose={this.closeModal}>
            <form className={styles.modalEvento} onSubmit={this.submitHandler}>
              <h2>Cadastrar evento</h2>
              <Input control={this.state.formEvento.nome}
                changeHandler={event => this.formChangeHandler(event.target.value, this.state.formEvento.nome)}/>
              <Input control={this.state.formEvento.local}
                changeHandler={event => this.formChangeHandler(event.target.value, this.state.formEvento.local)}/>
              <div>
                <Input control={this.state.formEvento.data}
                  changeHandler={event => this.formChangeHandler(event.target.value, this.state.formEvento.data)}/>
                <Select control={this.state.formEvento.turno}
                  options={this.turnosDisponiveisSelecao}
                  changeHandler={event => this.formChangeHandler(event.target.value, this.state.formEvento.turno)}/>
              </div>
              <button type="submit">Adicionar Evento</button>
            </form>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state: GlobalState) => {
  return {
    usuario: state.user
  }
}

export default connect(mapStateToProps)(Calendario);
