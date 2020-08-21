import React, { Component, TouchEvent } from 'react';
import styles from './calendario-slider.module.scss';
import { DIAS_SEMANA } from 'shared/utils/dias';
import { CheckboxItem } from 'shared/components/checkbox-list/checkbox-list';
import { Evento } from 'pages/calendario/services/evento.service';
import Wrapper from 'shared/components/wrapper/wrapper';
import ArrowLeft from 'assets/icons/arrow-left.svg'
import ArrowRight from 'assets/icons/arrow-right.svg'

interface Props {
    diaAtual: Date;
    semanaAtual: Date;
    turnos: CheckboxItem[];
    diasSemana: CheckboxItem[];
    verificarEventoAgendado: (dia: Date, turno: string) => Evento | undefined;
    modificarDia: (numDias: number) => void;
}

export class CalendarioSlider extends Component<Props> {

    touchStart = 0;
    translateX = 0;
    lastTouch = 0;
    passedToNext = false;
    scrollPositionOnStart = 0;
    triggerLimit = 250;
    scrollFactor = 0.8;
    elementRef = React.createRef<HTMLDivElement>();

    componentDidMount() {
        this.elemento.scrollTo({ behavior: 'auto', left: 3 * window.screen.width })
    }

    touchMoveHandler = (e: TouchEvent) => {
        this.translateX += (this.lastTouch - e.touches[0].clientX) * this.scrollFactor;
        this.lastTouch = e.touches[0].clientX;

        if (this.passedToNext) {
            return;
        } else {
            if (this.lastTouch - this.touchStart > this.limite) {
                this.passedToNext = true;
                this.scrollPositionOnStart = this.elemento.scrollLeft;
                // this.scrollLateralEsquerda.emit();
                this.elemento.scrollTo({ behavior: 'smooth', left: 2 * window.screen.width })
                // this.props.modificarDia(-1);
                this.waitForSmoothScroll(() => this.modificarReset(-1), 2);
            } else if (this.lastTouch - this.touchStart < -this.limite) {
                this.passedToNext = true;
                this.scrollPositionOnStart = this.elemento.scrollLeft;
                // this.scrollLateralDireta.emit();
                this.elemento.scrollTo({ behavior: 'smooth', left: 4 * window.screen.width })
                this.waitForSmoothScroll(() => this.modificarReset(1), 4);
            } else {
                this.elemento.scrollLeft = this.scrollPositionOnStart + this.translateX;
            }
        }
    }

    modificarReset = (num: number) => {
        this.props.modificarDia(num);
        this.elemento.scrollTo({ behavior: 'auto', left: 3 * window.screen.width });
    }

    waitForSmoothScroll(cb: CallableFunction, direction: number) {
        this.elemento.scrollTo({ behavior: 'smooth', left: window.innerWidth * direction });
        const funcao = () => {
            if (this.elemento.scrollLeft === window.innerWidth * direction) {
                cb();
            } else {
                requestAnimationFrame(funcao);
            }
        };
        requestAnimationFrame(funcao);
    }

    touchStartHandler = (e: TouchEvent) => {
        this.touchStart = e.touches[0].clientX;
        this.lastTouch = this.touchStart;
        this.scrollPositionOnStart = this.elemento.scrollLeft;
        this.passedToNext = false;
    }

    touchEndHandler = (e: TouchEvent) => {
        this.passedToNext ? this.translateX = 0 : this.resetarPosicao();
    }

    resetarPosicao() {
        this.elemento.scrollTo({ behavior: 'smooth', left: this.scrollPositionOnStart });
        this.translateX = 0;
    }

    get limite(): number {
        return this.triggerLimit ? this.triggerLimit : (window.innerWidth / 2);
    }

    get elemento(): HTMLElement {
        return this.elementRef.current as HTMLElement;
    }

    somaValorData(date: Date, num: number): number {
        const newData = new Date(date);
        newData.setDate(date.getDate() + num);
        return newData.getDate();
    }

    render() {

        const cardsDias = DIAS_SEMANA.map((dia: string, index: number) => (
            <div className={styles.cardCalendario} key={dia}>
                <div className={styles.heading}>
                    <p>{this.somaValorData(this.props.semanaAtual, index)}</p>
                    <h2>{dia}</h2>
                </div>
                <div className={styles.content}>
                    {this.props.turnos.map(turno => {
                        const dia = new Date(this.props.semanaAtual);
                        const isMobile = window.innerWidth < 770 && window.innerHeight > window.innerWidth

                        if (isMobile) {
                            dia.setUTCDate(dia.getUTCDate() + index + 2);
                        } else {
                            dia.setUTCDate(dia.getUTCDate() + index);
                        }

                        // if (turno.value && this.props.diasSemana[index].value) {
                        if (turno.value && this.props.diasSemana[ isMobile ? dia.getDay() : index].value) {
                            const agendado = this.props.verificarEventoAgendado(dia, turno.name);
                            return (
                                <div key={turno.name} className={styles.disponivel}>
                                    {agendado
                                        ? (
                                            <div className={styles.agendado}>
                                                <h3>{agendado.nome}</h3>
                                                <p>{agendado.local}</p>
                                            </div>
                                        )
                                        : (<p>{turno.name}</p>)}
                                </div>)
                        } else {
                            return <div key={turno.name} className={styles.indisponivel}>NÃO DISPONÍVEL</div>
                        }
                    })}
                </div>
            </div>
        ))

        return (
            <Wrapper>
                <img className={[styles.iconArrowLeft, styles.iconArrow].join(' ')}
                    onClick={() => this.props.modificarDia(-7)}
                    src={ArrowLeft}  
                    alt="arrow-left"/>
                <div className={styles.slider} ref={this.elementRef}
                    onTouchStart={this.touchStartHandler}
                    onTouchMove={this.touchMoveHandler}
                    onTouchEnd={this.touchEndHandler}>
                    {cardsDias}
                </div>
                <img className={[styles.iconArrowRight, styles.iconArrow].join(' ')}
                    onClick={() => this.props.modificarDia(7)}
                    src={ArrowRight}
                    alt="arrow-right"/>
            </Wrapper>
        )
    }
}


export default CalendarioSlider;