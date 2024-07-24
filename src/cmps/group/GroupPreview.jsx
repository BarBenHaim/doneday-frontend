import React, { useState } from 'react'
import 'monday-ui-react-core/dist/main.css'
import { ColorPicker, Button, MenuButton, Menu, MenuItem, EditableHeading } from 'monday-ui-react-core'
import TasksList from './task/TaskList'
import { Collapse, Delete, DropdownChevronDown, DropdownChevronRight } from 'monday-ui-react-core/icons'

function GroupPreview({
    group,
    members,
    labels,
    board,
    openModal,
    onUpdateGroup,
    onSort,
    sorting,
    isCollapsed,
    toggleCollapse,
    onRemoveGroup,
    onAddGroup,
    dragHandleProps,
}) {
    const [isEditingTitle, setIsEditingTitle] = useState(false)
    const [updatedGroupTitle, setUpdatedGroupTitle] = useState(group.title)
    const [groupColor, setGroupColor] = useState(group.style.backgroundColor || '#579bfc')

    const handleTitleChange = value => {
        setUpdatedGroupTitle(value)
    }

    const handleTitleBlur = () => {
        if (updatedGroupTitle !== group.title) {
            onUpdateGroup(board._id, group._id, { ...group, title: updatedGroupTitle })
        }
        setIsEditingTitle(false)
    }

    const handleColorSave = color => {
        setGroupColor(color.hex)
        onUpdateGroup(board._id, group._id, { ...group, backgroundColor: color.hex })
    }

    const openColorPicker = () => {
        ColorPicker.show({
            onSave: handleColorSave,
            initialColor: groupColor,
            onClose: () => {},
        })
    }

    return (
        <>
            <div
                className={`group-preview ${isCollapsed ? 'collapsed' : ''}`}
                style={{
                    borderInlineStart: isCollapsed ? `6px solid ${groupColor}` : 'none',
                }}
            >
                <div className='group-header' {...dragHandleProps}>
                    <MenuButton className='group-preview-menu-btn'>
                        <Menu id='menu' size='medium'>
                            <MenuItem onClick={() => onRemoveGroup(group._id)} icon={Delete} title='Delete' />
                            <MenuItem
                                onClick={() => {
                                    toggleCollapse()
                                }}
                                icon={Collapse}
                                title='Collapse'
                            />
                        </Menu>
                    </MenuButton>
                    <div className='flex align-center justify-center' style={{ position: 'sticky', left: '0' }}>
                        {isCollapsed ? (
                            <DropdownChevronRight
                                size={30}
                                style={{ color: groupColor }}
                                onClick={() => {
                                    toggleCollapse()
                                }}
                            />
                        ) : (
                            <DropdownChevronDown
                                size={30}
                                style={{ color: groupColor }}
                                onClick={() => {
                                    toggleCollapse()
                                }}
                            />
                        )}
                        {isEditingTitle && (
                            <Button
                                onClick={openColorPicker}
                                size='small'
                                style={{ backgroundColor: groupColor, width: '20px', height: '20px' }}
                            />
                        )}
                        <EditableHeading
                            type='h2'
                            value={updatedGroupTitle}
                            onChange={handleTitleChange}
                            onFinishEditing={handleTitleBlur}
                            onStartEditing={() => setIsEditingTitle(true)}
                            style={{ color: groupColor }}
                        />
                    </div>
                </div>
                {!isCollapsed && (
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
                            onAddGroup={onAddGroup}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default GroupPreview
