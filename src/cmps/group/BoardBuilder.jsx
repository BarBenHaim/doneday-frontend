import React, { useState, useEffect } from 'react'
import { generateBoardFromDescription } from '../../services/chatService'
import { addExistingBoard } from '../../store/actions/board.action'
import { Microphone, Night } from 'monday-ui-react-core/icons'
export function BoardBuilder() {
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [recognition, setRecognition] = useState(null)

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
        }

        speechRecognition.onerror = event => {
            setError('Voice recognition error: ' + event.error)
        }

        setRecognition(speechRecognition)
    }, [])

    const handleGenerateBoard = async () => {
        setLoading(true)
        setError(null)

        try {
            const generatedBoard = await generateBoardFromDescription(description)
            await addExistingBoard(generatedBoard)
        } catch (err) {
            console.error(err)
            setError('No more tokens... Please try again.')
        }
        setLoading(false)
    }

    const handleVoiceCommand = () => {
        if (recognition) {
            recognition.start()
        }
    }

    return (
        <div className='board-builder-container flex align-center justify-center'>
            <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder='Project description...'
            />
            {/* <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder='Enter project description here or use voice command...'
            /> */}
            <br />
            <button className='night-icon' onClick={handleGenerateBoard} disabled={loading}>
                {loading ? 'Generating...' : <Night size={18} />}
            </button>
            <button className='mic-icon' onClick={handleVoiceCommand} disabled={loading}>
                {loading ? 'Listening...' : <Microphone size={18} />}
            </button>
            {error && <p style={{ color: 'grey', fontSize: '0.775rem', margin: '0' }}>{error}</p>}
        </div>
    )
}