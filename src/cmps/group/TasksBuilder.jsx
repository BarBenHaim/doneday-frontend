import React, { useState } from 'react'
import { generateBoardFromDescription } from '../../services/chatService'
import { addExistingBoard } from '../../store/actions/board.action'

const TasksBuilder = () => {
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleGenerateBoard = async () => {
        setLoading(true)
        setError(null)

        try {
            const generatedBoard = await generateBoardFromDescription(description)
            await addExistingBoard(generatedBoard)
        } catch (err) {
            console.error(err)
            setError('Failed to generate board. Please try again.')
        }
        setLoading(false)
    }

    return (
        <div>
            <h1>Board Builder</h1>
            <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder='Enter project description here...'
                rows='5'
                cols='50'
            />
            <br />
            <button onClick={handleGenerateBoard} disabled={loading}>
                {loading ? 'Generating Board...' : 'Generate Board'}
            </button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    )
}

export default TasksBuilder
