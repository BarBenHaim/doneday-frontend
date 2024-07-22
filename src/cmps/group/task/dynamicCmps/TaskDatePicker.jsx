import React from 'react'
import { DatePicker, Dialog, DialogContentContainer, LinearProgressBar } from 'monday-ui-react-core'
import moment from 'moment'

function TaskDatePicker({ task, onUpdateField }) {
    const dueDate = task.dueDate ? moment(task.dueDate) : null
    const formattedDueDate = dueDate ? dueDate.format('YYYY-MM-DD') : 'No Due Date'
    const daysLeft = dueDate ? dueDate.diff(moment(), 'days') : null
    const totalDays = dueDate ? dueDate.diff(moment().subtract(2, 'months'), 'days') : 1
    const progress = daysLeft ? Math.max(((totalDays - daysLeft) / totalDays) * 100, 0) : 0

    return (
        <div className='monday-storybook-dialog--story-padding '>
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
                <div className='timeline' style={{ position: 'relative' }}>
                    <LinearProgressBar value={progress} />
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
