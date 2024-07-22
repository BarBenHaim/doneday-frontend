import React from 'react'
import { DatePicker, Dialog, DialogContentContainer } from 'monday-ui-react-core'
import moment from 'moment'
import { getStatusStyle } from './styleUtils'

function TaskDatePicker({ task, onUpdateField }) {
    const dueDate = task.dueDate ? moment(task.dueDate) : null
    const formattedDueDate = dueDate ? dueDate.format('D MMM') : 'No Due Date'
    const daysLeft = dueDate ? dueDate.diff(moment(), 'days') : null
    const statusStyle = getStatusStyle(task.status)

    return (
        <div className='monday-storybook-dialog--story-padding ' style={{ display: 'flex', margin: '0 auto' }}>
            <Dialog
                zIndex={2}
                content={
                    <DialogContentContainer>
                        <DatePicker
                            data-testid='date-picker'
                            date={dueDate}
                            onPickDate={value => onUpdateField(task, 'dueDate', value.format('YYYY-MM-DD'))}
                        />
                    </DialogContentContainer>
                }
                hideTrigger={['clickoutside']}
                modifiers={[
                    {
                        name: 'preventOverflow',
                        options: {
                            mainAxis: false,
                        },
                    },
                ]}
                position='bottom'
                showTrigger={['click']}
            >
                <div
                    className='timeline flex align-center justify-center'
                    style={{
                        position: 'relative',
                        ...statusStyle,
                        width: '108px',
                        textAlign: 'center',
                        borderRadius: '50px',
                        height: '22px',
                        fontSize: '0.875em',
                    }}
                >
                    <span style={{ fontSize: '0.875em' }}>{formattedDueDate}</span>
                    {dueDate && (
                        <div
                            className='hover-info'
                            style={{
                                position: 'absolute',
                                bottom: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: '#fff',
                                padding: '5px',
                                border: '1px solid #ccc',
                                borderRadius: '3px',
                                display: 'none',
                            }}
                        >
                            {daysLeft} days left
                        </div>
                    )}
                </div>
            </Dialog>
        </div>
    )
}

export default TaskDatePicker
