import React from 'react'
import { Dialog, DialogContentContainer } from 'monday-ui-react-core'
import { getStatusStyle } from './styleUtils'

const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    cursor: 'pointer',
}

const TaskStatus = ({ task, onUpdateField, columnKey }) => (
    <div style={cellStyle}>
        <Dialog
            zIndex={2}
            content={
                <DialogContentContainer style={{ width: '150px' }}>
                    <ul className='change-label-container flex align-center '>
                        {['Done', 'Working on it', 'Stuck', 'Not Started', 'Important'].map(status => (
                            <li
                                key={status}
                                style={getStatusStyle(status)}
                                onClick={() => {
                                    onUpdateField(task, columnKey, status)
                                }}
                            >
                                {status}
                            </li>
                        ))}
                    </ul>
                </DialogContentContainer>
            }
            hideTrigger={['clickoutside', 'onContentClick']}
            position='bottom'
            showTrigger={['click']}
        >
            <div style={{ ...cellStyle, ...getStatusStyle(task[columnKey] || 'Not Started'), fontSize: '0.875em' }}>
                {task[columnKey] || 'Not Started'}
            </div>
        </Dialog>
    </div>
)

export default TaskStatus
