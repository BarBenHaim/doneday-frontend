import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AddUpdate } from 'monday-ui-react-core/icons'
import { MsgIcon } from '../../../svgs/TaskSvg'
import ActivityModal from './ActivityModal'
import { openModal, closeModal } from '../../../../store/actions/board.action'

export function TaskComments({ task, members, onUpdateField }) {
    const dispatch = useDispatch()
    const isModalOpen = useSelector(state => state.boardModule.isModalOpen)
    alert(isModalOpen)
    const handleOpenModal = () => {
        dispatch(openModal())
    }

    const handleCloseModal = () => {
        dispatch(closeModal())
    }

    return (
        <div>
            <div
                className='flex align-center justify-center'
                style={{
                    width: '100%',
                    textAlign: 'center',
                    fontSize: '0.875em',
                    color: '#797A7E',
                }}
                onClick={handleOpenModal}
            >
                {!task.comments || task.comments.length === 0 ? (
                    <AddUpdate size={24} />
                ) : (
                    <div
                        className='flex align-center justify-center'
                        style={{
                            width: '100%',
                            textAlign: 'center',
                            fontSize: '0.875em',
                            color: '#797A7E',
                            position: 'relative',
                            display: 'inline-block',
                        }}
                    >
                        <MsgIcon size={30} />
                        <span className='msg-count'>{task.comments.length}</span>
                    </div>
                )}
            </div>
            {isModalOpen && (
                <ActivityModal
                    task={task}
                    members={members}
                    onUpdateField={onUpdateField}
                    initialTab={0}
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    )
}

export default TaskComments
