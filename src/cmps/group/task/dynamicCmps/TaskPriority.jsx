import React from 'react'
import { Dialog, DialogContentContainer } from 'monday-ui-react-core'
import { cellStyle, getPriorityStyle } from './styleUtils'

const TaskPriority = ({ task, onUpdateField }) => (
    <div style={cellStyle}>
        <Dialog
            zIndex={2}
            content={
                <DialogContentContainer style={{ width: '150px' }}>
                    <ul className='change-label-container flex align-center '>
                        {['Critical', 'High', 'Medium', 'Low'].map(priority => (
                            <li
                                key={priority}
                                style={getPriorityStyle(priority)}
                                onClick={() => onUpdateField(task, 'priority', priority)}
                            >
                                {priority}
                            </li>
                        ))}
                    </ul>
                </DialogContentContainer>
            }
            hideTrigger={['clickoutside']}
            position='bottom'
            showTrigger={['click']}
        >
            <div style={{ ...cellStyle, ...getPriorityStyle(task.priority || 'Medium'), fontSize: '0.875em' }}>
                {task.priority || 'Medium'}
            </div>
        </Dialog>
    </div>
)

export default TaskPriority
