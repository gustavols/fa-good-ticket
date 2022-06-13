import { NavbarMenu } from '../../components/Navbar';
import { FaCalendar, FaClock, FaUser, FaUserShield } from 'react-icons/fa';
import { BadgeHigh } from '../../components/BadgeHigh';
import { BadgeLow } from '../../components/BadgeLow';

import '../../styles/global.scss';
import '../../styles/ticketLife.scss';

import StatusTicketInProgress from '../../assets/images/StatusEmAndamento.svg';
import StatusTicketOpen from '../../assets/images/StatusAberto.svg';
import StatusTicketClose from '../../assets/images/StatusFinalizado.svg';
import axiosLogin from "../../login/axiosLogin";

import { CommentsArea } from '../../components/CommentsArea';
import { useEffect, useState } from 'react';
import { TableTicket } from '../../components/TableTicket';
import { useLocation, useNavigate } from 'react-router-dom';
import ControleSessao from '../../login/ControleSessao';
import { BadgeMedium } from '../../components/BadgeMedium';
import { URI } from '../../enum/uri';
import Handlers from '../../login/Handlers';

export function TicketLife() {
    const [chamados, setChamados] = useState([])
    const [autenticado, setAutenticado] = useState(true)
    const navigate = useNavigate()
    const [tickets, setTickets] = useState([])
    const [titulo, setTitulo] = useState('')
    const [descricao, setDescricao] = useState('')
    const [date, setDate] = useState('')
    const [hora, setHora] = useState('')
    const [relator, setRelator] = useState('')
    const [suporte, setSuporte] = useState('')
    const [prioridade, setPrioridade] = useState('')
    const [status, setStatus] = useState('')
    const [comentarios, setComentarios] = useState('')

    let support = {
        chamadoId: ControleSessao.getChamadoId(),
        email: ControleSessao.getUserEmail()
    }

    useEffect(() => {
        checarAutenticacao()
    }, [])

    const checarAutenticacao = async () => {
        const token = ControleSessao.getToken()
        if (token == null) {
            setAutenticado(false)
        } else {
            setAutenticado(true)
        }
        return autenticado
    }

    useEffect(() => {
        if (!autenticado) {
            navigate('/')
        }
    }, [autenticado, navigate])

    const handleGetAll = async () => {
        const resposta = await axiosLogin.get(URI.CHAMADOS_ABERTOS_EM_ANDAMENTO, {
            headers: {
                'Authorization': `Bearer ${ControleSessao.getToken()}`
            }
        })
        return resposta.data
    }

    const handler = new Handlers()

    const handlerNewSupport = (e: any) => {
        e.preventDefault()

        try {
            handler.handleNewSupport(support)
        } catch(err) {
            console.log(err)
            window.alert('Ocorreu um erro!')
        }
    }

    const getAllTickets = async () => {
        const allTickets: [] = await handleGetAll()
        if (ControleSessao.getUserCargo() == 'USER' || ControleSessao.getUserCargo() == 'SUPPORT') {
            allTickets.forEach(chamado => {
                if (chamado['id'] == ControleSessao.getChamadoId()) {
                    setTitulo(chamado['titulo'])
                    setDescricao(chamado['descricao'])
                    setDate(chamado['datahora'])
                    setPrioridade(chamado['prioridade'])
                    setStatus(chamado['status'])
                    setRelator(chamado['relator']['nome'])
                    if (chamado['suporte'] != null) {
                        setSuporte(chamado['suporte']['nome'])
                    } else {
                        setSuporte('--')
                    }

                    tickets.push(chamado)
                }
            })
            setChamados(tickets)
    }}
    useEffect(() => {
        getAllTickets()
    }, []);


    const prioridadesIcones = (priority: any) => {
        if (priority == 'Alta') {
            return <BadgeHigh />
        } else if (priority == 'Media') {
            return <BadgeMedium />
        } else {
            return <BadgeLow />
        }
    }

    const statusIcones = (priority: any) => {
        if (priority == 'Aberto') {
            return <img src={StatusTicketOpen} alt="" />
        } else {
            return <img src={StatusTicketInProgress} alt="" />
        }
    }

    return (
        <div>
            <NavbarMenu />
            <main id="main-content">
                <div className="content">
                    <div className="information-content">
                        <div className="info-ticket-all">
                            <div className='row-wreck'>
                                <div className="info-ticket">
                                    <span>Data/Hora de abertura:</span>
                                    <div className="info-ticket-icon">
                                        <FaCalendar />
                                        <span>{date}</span>
                                    </div>
                                </div>


                                <div className="info-ticket">
                                    <span>Criado por:</span>
                                    <div className="info-ticket-icon">
                                        <FaUser />
                                        <span>{relator}</span>
                                    </div>
                                </div>


                                <div className="info-ticket">
                                    <span>Analista responsável:</span>
                                    <div className="info-ticket-icon">
                                        <FaUserShield />
                                        <span>{suporte}</span>
                                    </div>
                                </div>

                                <div className="info-ticket">
                                    <button onClick={(e) => {handlerNewSupport(e)}}>RESERVAR CHAMADO</button>
                                </div>


                            </div>

                        </div>

                        <div className="info-input">
                            <div className="title-input">
                                <span>Titulo do chamado:</span>
                                <input placeholder={titulo} disabled />
                            </div>

                            <div className="summary-input">
                                <span>Descrição do chamado:</span>
                                <textarea placeholder={descricao} disabled />
                            </div>
                        </div>

                        <div className="info-badges">
                            <div className="badge-high">
                                <span>Prioridade:</span>
                                {prioridadesIcones(prioridade)}
                            </div>
                            <div className="badge-low">
                                <span>Status:</span> <br />
                                {statusIcones(status)}
                            </div>
                        </div>
                    </div>
                </div>
                <hr />
                <CommentsArea />
            </main>
        </div>
    )
}