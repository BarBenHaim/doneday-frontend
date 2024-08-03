import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ActivityModal from './dynamicCmps/ActivityModal.jsx'
import { closeModal, getActivities, loadBoards, updateTask } from '../../../store/actions/board.action.js'
import { showErrorMsg, showSuccessMsg } from '../../../services/event-bus.service.js'
import { loadUsers } from '../../../store/actions/user.actions.js'
import { getUserById } from '../../../services/util.service.js'

export const RootActivityModal = () => {
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const users = useSelector(storeState => storeState.userModule.users)
    const isModalOpen = useSelector(state => state.boardModule.isModalOpen)
    const activeTask = useSelector(state => state.boardModule.activeTask)
    const loggedinUser = useSelector(storeState => storeState.userModule.user)
    const activities = useSelector(state => state.boardModule.activities)

    const [currBoard, setCurrBoard] = useState(null)
    const [currGroup, setCurrGroup] = useState(null)

    const dispatch = useDispatch()

    // useEffect(() => {
    //     loadUsers()
    // }, [])

    useEffect(() => {
        if (!boards) {
            loadBoards()
            loadUsers()
        } else if (activeTask) {
            loadUsers()
            findCurrentBoardAndGroup()
        }
    }, [boards, activeTask])

    useEffect(() => {
        if (currBoard) {
            getActivities(currBoard._id)
        }
    }, [currBoard])

    // const mappedActivities =  activities ? activities.map(activity => {
    //     const user = users.find(user => user._id === activity.userId)
    //     return { ...activity, user }
    // }) : []

    const findCurrentBoardAndGroup = () => {
        for (let board of boards) {
            for (let group of board.groups) {
                if (group.tasks.some(task => task._id === activeTask._id)) {
                    setCurrBoard(board)
                    setCurrGroup(group)
                    return
                }
            }
        }
    }

    const handleCloseModal = () => {
        dispatch(closeModal())
    }

    async function onUpdateTask(updatedTask) {
        if (!currBoard || !currGroup) {
            showErrorMsg('Cannot update task: Board or Group not found')
            return
        }

        try {
            await updateTask(currBoard._id, currGroup._id, updatedTask._id, updatedTask)
            showSuccessMsg('Task updated successfully')
        } catch (err) {
            showErrorMsg('Cannot update task')
            console.log(err)
        }
    }

    function onUpdateField(task, field, value) {
        const updatedTask = { ...task, [field]: value }
        onUpdateTask(updatedTask)
    }

    if (!isModalOpen && !activeTask) return null

    return (
        <div className={`root-activity-modal ${isModalOpen ? 'open' : 'close'}`}>
            <ActivityModal
                task={activeTask}
                boardId={currBoard ? currBoard._id : null}
                groupId={currGroup ? currGroup._id : null}
                loggedinUser={loggedinUser}
                users={users}
                activities={activities}
                onUpdateField={onUpdateField}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialTab={0}
                currBoard={currBoard}
            />
        </div>
    )
}

export default RootActivityModal
