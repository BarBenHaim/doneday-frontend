import React from 'react'
import { useDispatch } from 'react-redux'
import { EditableText } from 'monday-ui-react-core'
import { Open } from 'monday-ui-react-core/icons'
import { openModal, setActiveTask } from '../../../../store/actions/board.action.js'
import TaskCommentsIcon from './../TaskCommentsIcon.jsx'

const TaskRow = ({ task, members, labels, onUpdateField, columnKey }) => {
    const dispatch = useDispatch()

    const handleOpenModal = () => {
        dispatch(setActiveTask(task))
        dispatch(openModal())
    }

    return (
        <div className='task-row'>
            <div
                className='task-row-title flex align-center'
                style={{ cursor: 'text', justifyContent: 'space-between' }}
            >
                <EditableText value={task[columnKey]} onChange={value => onUpdateField(task, columnKey, value)} />
                <div
                    onClick={handleOpenModal}
                    className='flex align-center open-btn-container'
                    style={{ marginInlineStart: '10px' }}
                >
                    <Open className='open-btn' style={{ opacity: '.7' }} />
                    <span className='open-btn' style={{ fontSize: '0.775rem' }}>
                        Open
                    </span>
                </div>
            </div>
            <div className='task-row-comments'>
                <TaskCommentsIcon task={task} onOpen={handleOpenModal} />
            </div>
        </div>
    )
}

export default TaskRow
