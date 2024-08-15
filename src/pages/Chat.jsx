import React, { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import {
    socketService,
    SOCKET_EMIT_SEND_MSG,
    SOCKET_EVENT_ADD_MSG,
    SOCKET_EMIT_SET_TOPIC,
    SOCKET_EVENT_BOARD_ADDED,
    SOCKET_EVENT_BOARD_UPDATED,
    SOCKET_EVENT_BOARD_REMOVED,
    SOCKET_EVENT_GROUP_ADDED,
    SOCKET_EVENT_GROUP_UPDATED,
    SOCKET_EVENT_GROUP_REMOVED,
    SOCKET_EVENT_TASK_ADDED,
    SOCKET_EVENT_TASK_UPDATED,
    SOCKET_EVENT_TASK_REMOVED,
} from '../services/socket.service'

export function ChatApp() {
    const { boardId } = useParams()
    const [msg, setMsg] = useState({ txt: '' })
    const [msgs, setMsgs] = useState([])
    const [topic, setTopic] = useState(boardId)
    const [isBotMode, setIsBotMode] = useState(false)

    const loggedInUser = useSelector(storeState => storeState.userModule.user)

    const botTimeoutRef = useRef()

    useEffect(() => {
        socketService.on(SOCKET_EVENT_ADD_MSG, addMsg)
        socketService.on(SOCKET_EVENT_BOARD_ADDED, addMsg)
        socketService.on(SOCKET_EVENT_BOARD_UPDATED, addMsg)
        socketService.on(SOCKET_EVENT_BOARD_REMOVED, removeMsg)
        socketService.on(SOCKET_EVENT_GROUP_ADDED, addMsg)
        socketService.on(SOCKET_EVENT_GROUP_UPDATED, addMsg)
        socketService.on(SOCKET_EVENT_GROUP_REMOVED, removeMsg)
        socketService.on(SOCKET_EVENT_TASK_ADDED, addMsg)
        socketService.on(SOCKET_EVENT_TASK_UPDATED, addMsg)
        socketService.on(SOCKET_EVENT_TASK_REMOVED, removeMsg)
        return () => {
            socketService.off(SOCKET_EVENT_ADD_MSG, addMsg)
            socketService.off(SOCKET_EVENT_BOARD_ADDED, addMsg)
            socketService.off(SOCKET_EVENT_BOARD_UPDATED, addMsg)
            socketService.off(SOCKET_EVENT_BOARD_REMOVED, removeMsg)
            socketService.off(SOCKET_EVENT_GROUP_ADDED, addMsg)
            socketService.off(SOCKET_EVENT_GROUP_UPDATED, addMsg)
            socketService.off(SOCKET_EVENT_GROUP_REMOVED, removeMsg)
            socketService.off(SOCKET_EVENT_TASK_ADDED, addMsg)
            socketService.off(SOCKET_EVENT_TASK_UPDATED, addMsg)
            socketService.off(SOCKET_EVENT_TASK_REMOVED, removeMsg)
            botTimeoutRef.current && clearTimeout(botTimeoutRef.current)
        }
    }, [])

    useEffect(() => {
        socketService.emit(SOCKET_EMIT_SET_TOPIC, topic)
    }, [topic])

    function addMsg(newMsg) {
        setMsgs(prevMsgs => [...prevMsgs, newMsg])
    }

    function removeMsg(msgId) {
        setMsgs(prevMsgs => prevMsgs.filter(msg => msg._id !== msgId))
    }

    function sendBotResponse() {
        botTimeoutRef.current && clearTimeout(botTimeoutRef.current)
        botTimeoutRef.current = setTimeout(() => {
            setMsgs(prevMsgs => [...prevMsgs, { from: 'Bot', txt: 'You are amazing!' }])
        }, 1250)
    }

    function sendMsg(ev) {
        ev.preventDefault()
        const from = loggedInUser?.fullname || 'Me'
        const newMsg = { from, txt: msg.txt }
        socketService.emit(SOCKET_EMIT_SEND_MSG, newMsg)
        if (isBotMode) sendBotResponse()
        setMsg({ txt: '' })
    }

    function handleFormChange(ev) {
        const { name, value } = ev.target
        setMsg(prevMsg => ({ ...prevMsg, [name]: value }))
    }

    return (
        <section className='chat'>
            <h2>Lets Chat about {topic}</h2>

            <label>
                <input
                    type='checkbox'
                    name='isBotMode'
                    checked={isBotMode}
                    onChange={({ target }) => setIsBotMode(target.checked)}
                />
                Bot Mode
            </label>
            <form onSubmit={sendMsg}>
                <input type='text' value={msg.txt} onChange={handleFormChange} name='txt' autoComplete='off' />
                <button>Send</button>
            </form>

            <ul>
                {msgs.map((msg, idx) => (
                    <li key={idx}>
                        {msg.from}: {msg.txt}
                    </li>
                ))}
            </ul>
        </section>
    )
}
