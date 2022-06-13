import { Component, useEffect, useState } from 'react';
import CadastradorChamado from '../../cadastradores/cadastradorChamado';

import { Button } from '../../components/Button';
import { NavbarMenu } from '../../components/Navbar';

import '../../styles/newTicket.scss';
import '../../styles/global.scss';
import ControleSessao from '../../login/ControleSessao';
import { useNavigate } from 'react-router-dom';
import Handlers from '../../login/Handlers';

export function NewTicket(){

    const [autenticado, setAutenticado] = useState(true)
    const navigate = useNavigate()

    const [titulo, setTitulo] = useState(String)
    const [descricao, setDescricao] = useState(String)
    const [local, setLocal] = useState(String)
    const [tipo, setTipo] = useState(String)
    const [equipamento, setEquipamento] = useState(String)
    const [descri_equipamento, setDescri_equipamento] = useState(String)
    const [num_maquina, setNum_maquina] = useState(Number)
    const [sala, setSala] = useState(Number)
    const [prioridade, setPrioridade] = useState(String)
    const [email, setEmail] = useState(ControleSessao.getUserEmail())

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
    }

    useEffect(() => {
        if (!autenticado || ControleSessao.getUserCargo() != 'USER') {
            navigate('/')
        }
    }, [autenticado, navigate])

    let handlers = new Handlers()

    let chamado = {
        titulo: titulo,
        descricao: descricao,
        local: local,
        tipo: tipo,
        equipamento: equipamento,
        descri_equipamento: descri_equipamento,
        num_maquina: num_maquina,
        sala: sala,
        prioridade: prioridade,
        email: email
    }

    const handlerNewTicket = (e: any) => {
        e.preventDefault()

        try {
            handlers.handleNewTicket(chamado)
        } catch(err) {
            console.log(err)
            window.alert('Ocorreu um erro!')
        }
    }

    return (
        <div id="new-ticket-content">
           <NavbarMenu />
            <main>
                <div id="main-ticket-content">
                    <form onSubmit={(e) => handlerNewTicket(e)}>
                        <div className="form-group-textarea">
                            <span>Título:</span>
                            <input onChange={(e) => setTitulo(e.target.value)} id="titulo" type="text" placeholder="Insira o título do chamado..." required/>
                            <span>Descrição do problema:</span>
                            <textarea onChange={(e) => setDescricao(e.target.value)} id="descricao" placeholder="Descreva o seu problema..." required/>
                        </div>
                        <div className="form-input">
                            <div className="form-collection"> 
                                <div className="form-input-box">
                                    <span>Local:</span>
                                    <input onChange={(e) => setLocal(e.target.value)} id="local" type='text' placeholder="Insira o local..." className="mr" required/>
                                </div>
                                <div className="form-input-box-2">
                                    <span>Hardware ou Software:</span>
                                    <select onChange={(e) => setTipo(e.target.value)} id="tipo" required>
                                        <option>Escolha uma opção...</option>
                                        <option>Software</option>
                                        <option>Hardware</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-collection">
                                <div className="form-input-box">
                                    <span>Sala:</span>
                                    <input onChange={(e) => setSala(parseInt(e.target.value))} id="sala" type="number" placeholder="Insira o número da sala..."  className="mr" required/>
                                </div>
                                <div className="form-input-box-2">
                                    <span>Equipamento:</span>
                                    <input onChange={(e) => setEquipamento(e.target.value)} id="equipamento" type="text" placeholder="Equipamento danificado..." required/>
                                </div>
                            </div>

                            <div className="form-collection">
                                <div className="form-input-box">
                                    <span>ID do equipamento: </span>
                                    <input onChange={(e) => setNum_maquina(parseInt(e.target.value))} id="num_maquina" type="number" placeholder="ID do equipamento..." className="mr" required/>
                                </div>
                                <div className="form-input-box-2">
                                    <span>Descrição do equipamento:</span>
                                    <input onChange={(e) => setDescri_equipamento(e.target.value)} id="descri_equipamento" type="text" placeholder="Descrição do equipamento..." required/>
                                </div> 
                            </div>
                        </div>

                        <div className='form-collection-3'>
                            <div className="form-input-box">
                                <span>Prioridade:</span>
                                <select onChange={(e) => setPrioridade(e.target.value)} id="prioridade" required>
                                    <option selected>Prioridade</option>
                                    <option>Alta</option>
                                    <option>Baixa</option>
                                </select>
                                <Button type='submit' name='action'>Criar chamado</Button>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
    
}
