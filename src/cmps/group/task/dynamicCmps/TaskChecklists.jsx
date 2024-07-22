import React, { useState } from 'react'
import { Dialog, DialogContentContainer, Button, Checkbox } from 'monday-ui-react-core'

const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
}

function TaskChecklists({ task, members, onUpdateField }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [newChecklistTitle, setNewChecklistTitle] = useState('')
    const [newChecklistItem, setNewChecklistItem] = useState('')
    const [selectedChecklistId, setSelectedChecklistId] = useState(null)

    const handleAddChecklist = () => {
        const newChecklist = {
            _id: Date.now().toString(),
            title: newChecklistTitle,
            items: [],
        }
        const updatedChecklists = [...task.checklists, newChecklist]
        onUpdateField(task, 'checklists', updatedChecklists)
        setNewChecklistTitle('')
    }

    const handleAddChecklistItem = () => {
        const updatedChecklists = task.checklists.map(checklist => {
            if (checklist._id === selectedChecklistId) {
                return {
                    ...checklist,
                    items: [
                        ...checklist.items,
                        { _id: Date.now().toString(), title: newChecklistItem, checked: false },
                    ],
                }
            }
            return checklist
        })
        onUpdateField(task, 'checklists', updatedChecklists)
        setNewChecklistItem('')
    }

    const handleToggleChecklistItem = (checklistId, itemId) => {
        const updatedChecklists = task.checklists.map(checklist => {
            if (checklist._id === checklistId) {
                return {
                    ...checklist,
                    items: checklist.items.map(item =>
                        item._id === itemId ? { ...item, checked: !item.checked } : item
                    ),
                }
            }
            return checklist
        })
        onUpdateField(task, 'checklists', updatedChecklists)
    }

    return (
        <div style={cellStyle}>
            <Dialog
                zIndex={2}
                isOpen={isDialogOpen}
                onDialogDidHide={() => setIsDialogOpen(false)}
                content={
                    <DialogContentContainer>
                        <div>
                            <EditableText
                                value={newChecklistTitle}
                                onChange={value => setNewChecklistTitle(value)}
                                placeholder='Add a checklist title'
                            />
                            <Button onClick={handleAddChecklist}>Add Checklist</Button>
                            <div>
                                {task.checklists.map(checklist => (
                                    <div key={checklist._id}>
                                        <h4 onClick={() => setSelectedChecklistId(checklist._id)}>{checklist.title}</h4>
                                        {selectedChecklistId === checklist._id && (
                                            <div>
                                                <EditableText
                                                    value={newChecklistItem}
                                                    onChange={value => setNewChecklistItem(value)}
                                                    placeholder='Add a checklist item'
                                                />
                                                <Button onClick={handleAddChecklistItem}>Add Item</Button>
                                                <ul>
                                                    {checklist.items.map(item => (
                                                        <li key={item._id}>
                                                            <Checkbox
                                                                checked={item.checked}
                                                                onChange={() =>
                                                                    handleToggleChecklistItem(checklist._id, item._id)
                                                                }
                                                            />
                                                            {item.title}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </DialogContentContainer>
                }
                hideTrigger={['clickoutside']}
                position='bottom'
                showTrigger={['click']}
            >
                <div
                    style={{ width: '100%', textAlign: 'center', fontSize: '0.875em' }}
                    onClick={() => setIsDialogOpen(true)}
                >
                    View/Add Checklists
                </div>
            </Dialog>
        </div>
    )
}

export default TaskChecklists
