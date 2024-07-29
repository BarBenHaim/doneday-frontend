import React, { useEffect, useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../../services/event-bus.service'
import { addGroup, addTask, getEmptyTask } from '../../store/actions/board.action'
import { Night } from 'monday-ui-react-core/icons'
export function AiAssistant({ boardId }) {
    const [taskList, setTaskList] = useState([])

    async function onAddGroupsWithTasks(boardId, numberOfGroups, numberOfTasks) {
        try {
            const addGroupPromises = []

            for (let i = 0; i < numberOfGroups; i++) {
                const groupTitle = `New Group ${i + 1}`
                addGroupPromises.push(addGroup(boardId, groupTitle))
            }

            const newGroups = await Promise.all(addGroupPromises)
            for (let i = 0; i < newGroups.length; i++) {
                await onAddTasks(numberOfTasks, newGroups[i]._id)
            }

            showSuccessMsg(`${numberOfGroups} groups with ${numberOfTasks} tasks each added successfully`)
        } catch (err) {
            showErrorMsg('Cannot add groups with tasks')
            console.error(err)
        }
    }

    async function onAddTasks(numberOfTasks, groupId) {
        try {
            const addTaskPromises = []

            for (let i = 0; i < numberOfTasks; i++) {
                const taskTitle = `Task ${i + 1}`
                addTaskPromises.push(addTask(boardId, groupId, getEmptyTask(), taskTitle))
            }

            const addedTasks = await Promise.all(addTaskPromises)
            setTaskList(prevTaskList => [...prevTaskList, ...addedTasks])
            showSuccessMsg(`${numberOfTasks} tasks added successfully`)
        } catch (err) {
            showErrorMsg('Cannot add tasks')
            console.error(err)
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
            alert(`You said: ${speechResult}`)
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

        const commandMatch = command.match(
            /make me (\d+|one|two|three|four|five|six|seven|eight|nine|ten) groups? with (\d+|one|two|three|four|five|six|seven|eight|nine|ten) tasks?/i
        )

        if (commandMatch) {
            let groupsNum = commandMatch[1]
            let tasksNum = commandMatch[2]

            if (isNaN(groupsNum)) {
                groupsNum = numberWords[groupsNum.toLowerCase()]
            } else {
                groupsNum = parseInt(groupsNum)
            }

            if (isNaN(tasksNum)) {
                tasksNum = numberWords[tasksNum.toLowerCase()]
            } else {
                tasksNum = parseInt(tasksNum)
            }

            onAddGroupsWithTasks(boardId, groupsNum, tasksNum)
        } else {
            showErrorMsg('Please say "make me X groups with Y tasks"')
        }
    }

    const handleVoiceCommand = () => {
        recognition.start()
    }

    return (
        <div className='ai-assistant'>
            <div className='doneday-assistant' onClick={handleVoiceCommand}>
                <span className='doneday-txt'>donedy</span>
                <span className='doneday-icon'>
                    <Night size={15} />
                </span>
            </div>
        </div>
    )
}
