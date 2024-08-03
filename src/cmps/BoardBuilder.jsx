import React, { useState, useEffect } from 'react'
import { addExistingBoard } from '../store/actions/board.action.js'
import { Microphone, Night } from 'monday-ui-react-core/icons'
import { BreadcrumbLoader } from './BreadcrumbLoader.jsx'
import { generateBoard } from '../services/board/board.service.remote.js'

export function BoardBuilder() {
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [recognition, setRecognition] = useState(null)
    const [isRecording, setIsRecording] = useState(false)
    const [isVoiceInput, setIsVoiceInput] = useState(false)

    useEffect(() => {
        let speechRecognition
        if ('webkitSpeechRecognition' in window) {
            speechRecognition = new window.webkitSpeechRecognition()
        } else {
            speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
        }
        speechRecognition.lang = 'en-US'
        speechRecognition.interimResults = false
        speechRecognition.maxAlternatives = 1

        speechRecognition.onresult = event => {
            const speechResult = event.results[0][0].transcript
            setDescription(speechResult)
            setIsRecording(false)
            setIsVoiceInput(true)
        }

        speechRecognition.onerror = event => {
            setError('Voice recognition error: ' + event.error)
            setIsRecording(false)
        }

        setRecognition(speechRecognition)
    }, [])

    const handleGenerateBoard = async () => {
        setLoading(true)
        setError(null)

        try {
            const board = await generateBoard({ description })
            await addExistingBoard(board.data)
        } catch (err) {
            console.error(err)
            setError('No more tokens... Please try again.')
        }
        setLoading(false)
    }

    const handleVoiceCommand = () => {
        if (recognition) {
            recognition.start()
            setIsRecording(true)
        }
    }

    const handleInputChange = e => {
        setDescription(e.target.value)
        setIsVoiceInput(false)
    }

    const handleGenerateButtonClick = () => {
        handleGenerateBoard()
    }

    useEffect(() => {
        if (recognition && description && isVoiceInput) {
            handleGenerateBoard()
        }
    }, [description, isVoiceInput])

    return (
        <>
            {loading && <BreadcrumbLoader />}
            <div className='board-builder-container flex align-center justify-center'>
                <input value={description} onChange={handleInputChange} placeholder='Project description...' />
                <br />
                <button className='night-icon' onClick={handleGenerateButtonClick} disabled={loading}>
                    {loading ? 'Generating...' : <Night size={18} />}
                </button>
                <button className='mic-icon' onClick={handleVoiceCommand} disabled={loading || isRecording}>
                    {isRecording ? 'Recording...' : <Microphone size={18} />}
                </button>
                {error && <p style={{ color: 'grey', fontSize: '0.775rem', margin: '0' }}>{error}</p>}
            </div>
        </>
    )
}
