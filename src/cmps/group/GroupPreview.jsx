import React, { useState } from 'react'
import 'monday-ui-react-core/dist/main.css'
import { ColorPicker, Button } from 'monday-ui-react-core'
import TasksList from './task/TaskList'

function GroupPreview({ group, members, labels, board, openModal, onUpdateGroup, onSort, sorting, onAddColumn }) {
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [isColorsModal, setIsColorsModal] = useState(false)
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
                <div className='flex align-center justify-center '>
                    <button onClick={() => setIsColorsModal(true)}>Color</button>
                    <input
                        type='text'
                        value={updatedGroupTitle}
                        onChange={handleTitleChange}
                        onBlur={handleTitleBlur}
                        onKeyPress={handleKeyPress}
                        autoFocus
                        className='editable-title'
                        style={{ color: `${group.style.backgroundColor || '#579bfc'}` }}
                    />
                    {isColorsModal && <ColorPicker onSave={function noRefCheck() {}} />}
                </div>
            ) : (
                <h2
                    onClick={() => setIsEditingTitle(true)}
                    style={{ color: `${group.style.backgroundColor || '#579bfc'}` }}
                >
                    {group.title}{' '}
                </h2>
            )}
            <Button onClick={() => onAddColumn(group._id)}>+ Add Column</Button>
            <div className='table-wrapper'>
                <TasksList
                    tasks={group.tasks}
                    members={members}
                    labels={labels}
                    board={board}
                    group={group}
                    openModal={openModal}
                    onSort={onSort}
                    sorting={sorting}
                />
            </div>
        </div>
    )
}

export default GroupPreview
