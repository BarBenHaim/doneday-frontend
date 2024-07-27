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

    if (!isModalOpen && !activeTask) return null

    return (
        <div className={`root-activity-modal ${isModalOpen ? 'open' : 'close'}`}>
            <ActivityModal
                task={activeTask}
                members={activeTask.members}
                onUpdateField={activeTask.onUpdateField}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                initialTab={0}
            />
        </div>
    )
}
