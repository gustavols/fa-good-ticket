import '../styles/commentsArea.scss';
import { FaAngleRight } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ControleSessao from '../login/ControleSessao';
import Handlers from '../login/Handlers';
import userIcon from "../assets/images/userIcon.svg";
import horaIcon from "../assets/images/horaIcon.svg";
import SolutionIcon from "../assets/images/verificado.png";
import { URI } from '../enum/uri';
import axiosLogin from '../login/axiosLogin';


export function CommentsArea() {
    const [body, setBody] = useState('')
    const [comentarios, setComentarios] = useState([])
    const [solutionBody, setSolutionBody] = useState('')
    const navigate = useNavigate()

    let comentario = {
        body: body,
        chamadoId: ControleSessao.getChamadoId(),
        email: ControleSessao.getUserEmail()
    }

    let solucao = {
        body: solutionBody,
        chamadoId: ControleSessao.getChamadoId(),
        email: ControleSessao.getUserEmail()
    }


    const handler = new Handlers()

    const handlerNovoComentario = (e: any) => {
        e.preventDefault()

        try {
            handler.handleNewComment(comentario)
        } catch (err) {
            console.log(err)
            window.alert('Ocorreu um erro!')
        }
    }

    const handlerNovaSolucao = (e: any) => {
        e.preventDefault()

        try {
            handler.handleNewSolution(solucao)
        } catch (err) {
            console.log(err)
            window.alert('Ocorreu um erro!')
        }
    }

    const handleGetAll = async () => {
        const resposta = await axiosLogin.get(URI.CHAMADOS_ABERTOS_EM_ANDAMENTO, {
            headers: {
                'Authorization': `Bearer ${ControleSessao.getToken()}`
            }
        })
        return resposta.data
    }

    const getAllTickets = async () => {
        const allTickets: [] = await handleGetAll()
        if (ControleSessao.getUserCargo() == 'USER' || ControleSessao.getUserCargo() == 'SUPPORT') {
            allTickets.forEach(chamado => {
                if (chamado['id'] == ControleSessao.getChamadoId()) {
                    if (chamado['comentarios'] != null) {
                        setComentarios(chamado['comentarios'])
                    }

                }
            })
        }
    }
    useEffect(() => {
        getAllTickets()
    }, []);

    const [comenta, setComenta] = useState('');


    useEffect(() => {



    }, []);


    return (
        <div className='comments-area'>
            {comentarios.map((comentario: any) => (
                <div className='comentariosChamados'>
                    <div className="firstComentario">
                        <div className="hora_dataComentario">
                            <div className="horaComentario">
                                <span><img src={horaIcon} alt="goodticket" />{comentario["datahora"]}</span>
                            </div>
                            <div className="nomeComentario">
                                <span> <img src={userIcon} alt="goodticket" />{comentario["usuario"]['nome']}</span>
                            </div>
                        </div>

                        <div className="textoComentario">
                            <span> {comentario['body']}</span>
                        </div>
                        <div className='solutionInserir'>
                            <button onClickCapture={(e) => { setSolutionBody(comentario['body']) }} onClick={(e) => { handlerNovaSolucao(e) }} >SOLUÇÃO<img src={SolutionIcon} alt="goodticket" />
                            </button>
                        </div>

                    </div>
                </div>
            ))}

            <div className='envioChamado'>
                <form action="" onSubmit={(e: any) => handlerNovoComentario(e)}>

                    <input placeholder='Digite seu comentário aqui...' onChange={(e) => { setBody(e.target.value) }} required />
                    <button type='submit'>INSERIR</button>
                </form>
            </div>
        </div>
    )
}