import React, { useState } from 'react'
import 'monday-ui-react-core/dist/main.css'
import TasksList from './TaskList'

function GroupPreview({ group, members, labels, board, openModal, onUpdateGroup }) {
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [updatedGroupTitle, setUpdatedGroupTitle] = useState(group.title)
    const handleTitleChange = e => {
        setUpdatedGroupTitle(e.target.value)
    }

    const handleTitleBlur = () => {
        if (updatedGroupTitle !== group.title) {
            onUpdateGroup(board._id, group._id, { title: updatedGroupTitle })
        }
        setIsEditingTitle(false)
    }

    const handleKeyPress = e => {
        if (e.key === 'Enter') {
            handleTitleBlur()
        }
    }

    return (
        <div className='group-preview'>
            {isEditingTitle ? (
                <input
                    type='text'
                    value={updatedGroupTitle}
                    onChange={handleTitleChange}
                    onBlur={handleTitleBlur}
                    onKeyPress={handleKeyPress}
                    autoFocus
                    className='editable-title'
                />
            ) : (
                <h2 onClick={() => setIsEditingTitle(true)}>{group.title}</h2>
            )}
            <div className='table-wrapper'>
                <TasksList
                    tasks={group.tasks}
                    members={members}
                    labels={labels}
                    board={board}
                    group={group}
                    openModal={openModal}
                />
            </div>
        </div>
    )
}

export default GroupPreview
