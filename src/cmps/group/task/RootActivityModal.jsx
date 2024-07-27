import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import ActivityModal from './dynamicCmps/ActivityModal.jsx'
import { closeModal } from '../../../store/actions/board.action.js'

export const RootActivityModal = () => {
    const dispatch = useDispatch()
    const isModalOpen = useSelector(state => state.boardModule.isModalOpen)
    const activeTask = useSelector(state => state.boardModule.activeTask)

    const handleCloseModal = () => {
        dispatch(closeModal())
    }

    const handleUpdateTask = async (task, field, value) => {
        const updatedTask = { ...task, [field]: value }
        try {
            console.log('Updating task in backend:', updatedTask)
        } catch (err) {
            console.error('Failed to update task:', err)
        }
    }

    if (!isModalOpen && !activeTask) return null

    return (
        <div className={`root-activity-modal ${isModalOpen ? 'open' : 'close'}`}>
            <ActivityModal
                task={activeTask}
                members={activeTask.members}
                onUpdateField={handleUpdateTask}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialTab={0}
            />
        </div>
    )
}

export default RootActivityModal
