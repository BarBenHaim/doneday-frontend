import React, { useState, useEffect } from 'react'
import { addExistingBoard } from '../store/actions/board.action.js'
import { Announcement, Microphone, Night } from 'monday-ui-react-core/icons'
import { generateBoard } from '../services/board/board.service.remote.js'
import { AiLoader } from './AiLoader.jsx'

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
            <AiLoader isLoading={loading} />
            {!loading && (
                <section className='board-builder'>
                    <h2 className='board-builder-title'>Generate your project in seconds</h2>
                    <div className='board-builder-wrapper'>
                        <div className='input-button-group'>
                            <button
                                className='icon-button voice-button'
                                onClick={handleVoiceCommand}
                                disabled={loading || isRecording}
                            >
                                {isRecording ? <Announcement size={18} /> : <Microphone size={18} />}
                            </button>
                            <input
                                value={description}
                                onChange={handleInputChange}
                                placeholder='Describe your project...'
                                className='description-input'
                            />
                            <button
                                className='icon-button generate-button'
                                onClick={handleGenerateButtonClick}
                                disabled={loading}
                            >
                                {loading ? (
                                    'Generating...'
                                ) : (
                                    <span className='generate-button'>
                                        <Night size={18} />
                                        Generate
                                    </span>
                                )}
                            </button>
                        </div>
                        {error && <p className='error-message'>{error}</p>}
                    </div>
                </section>
            )}
        </>
    )
}
