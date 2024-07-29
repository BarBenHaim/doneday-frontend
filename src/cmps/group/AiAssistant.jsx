import React, { useEffect } from 'react'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { addGroup } from '../../store/actions/board.action'
import { useSelector, useDispatch } from 'react-redux'

export function AiAssistant({ boardId }) {
    const currBoard = useSelector(storeState => storeState.boardModule.boards.find(board => board._id === boardId))

    async function onAddTasks(numberOfTasks, groupId) {
        try {
            const addTaskPromises = []

            for (let i = 0; i < numberOfTasks; i++) {
                const taskTitle = `Task ${i + 1}`
                addTaskPromises.push(dispatch(addTask(boardId, groupId, { title: taskTitle })))
            }

            const addedTasks = await Promise.all(addTaskPromises)
            setTaskList([...taskList, ...addedTasks])
            showSuccessMsg(`${numberOfTasks} tasks added successfully`)
        } catch (err) {
            showErrorMsg('Cannot add tasks')
            console.error(err)
        }
    }

    async function onAddGroups(boardId, numberOfGroups) {
        try {
            const addGroupPromises = []

            for (let i = 0; i < numberOfGroups; i++) {
                const groupTitle = `New Group ${i + 1}`
                addGroupPromises.push(addGroup(boardId, groupTitle))
            }

            await Promise.all(addGroupPromises)
            showSuccessMsg(`${numberOfGroups} groups added successfully`)
        } catch (err) {
            showErrorMsg('Cannot add groups')
        }
    }

    let recognition
    if ('webkitSpeechRecognition' in window) {
        recognition = new window.webkitSpeechRecognition()
    } else {
        recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)()
    }
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    useEffect(() => {
        recognition.onresult = event => {
            const speechResult = event.results[0][0].transcript
            handleCommand(speechResult)
        }

        recognition.onerror = event => {
            showErrorMsg('Voice recognition error: ' + event.error)
        }
    }, [recognition])

    const handleCommand = command => {
        const numberWords = {
            one: 1,
            two: 2,
            three: 3,
            four: 4,
            five: 5,
            six: 6,
            seven: 7,
            eight: 8,
            nine: 9,
            ten: 10,
        }

        const commandMatch = command.match(/make me (\d+|one|two|three|four|five|six|seven|eight|nine|ten) groups?/i)
        if (commandMatch) {
            let groupsNum = commandMatch[1]
            if (isNaN(groupsNum)) {
                groupsNum = numberWords[groupsNum.toLowerCase()]
            } else {
                groupsNum = parseInt(groupsNum)
            }
            onAddGroups(boardId, groupsNum)
        } else {
            showErrorMsg('Voice command not recognized. Please say "make me X groups"')
        }
    }

    const handleVoiceCommand = () => {
        recognition.start()
    }

    return (
        <div className='ai-assistant'>
            <button onClick={handleVoiceCommand}>Ai Assistant</button>
        </div>
    )
}
