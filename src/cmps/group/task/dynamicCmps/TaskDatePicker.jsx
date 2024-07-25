import React from 'react'
import { DatePicker, Dialog, DialogContentContainer } from 'monday-ui-react-core'
import moment from 'moment'
import { getStatusStyle } from './styleUtils'
import { Close } from 'monday-ui-react-core/icons'

function TaskDatePicker({ task, onUpdateField, columnKey }) {
    const dueDate = task[columnKey] ? moment(task[columnKey]) : null
    const formattedDueDate = dueDate ? dueDate.format('D MMM') : ''
    let daysLeft = dueDate ? dueDate.diff(moment(), 'days') : null
    daysLeft = daysLeft !== null && daysLeft < 0 ? 0 : daysLeft
    const statusStyle = dueDate ? getStatusStyle(task.status) : { backgroundColor: '#C4C4C4', color: '#F7F7F8' }
    const { backgroundColor } = statusStyle

    const handleResetDate = () => {
        onUpdateField(task, columnKey, null)
    }

    return (
        <div className='monday-storybook-dialog--story-padding ' style={{ display: 'flex', margin: '0 auto' }}>
            <Dialog
                zIndex={2}
                content={
                    <DialogContentContainer>
                        <DatePicker
                            data-testid='date-picker'
                            date={dueDate}
                            onPickDate={value => onUpdateField(task, columnKey, value.format('YYYY-MM-DD'))}
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
                        cursor: 'pointer',
                        position: 'relative',
                        ...statusStyle,
                        width: '108px',
                        textAlign: 'center',
                        borderRadius: '50px',
                        height: '22px',
                        fontSize: '0.875em',
                    }}
                    title={dueDate ? `${daysLeft} days left` : ''}
                >
                    <span style={{ fontSize: '0.875em' }}>{dueDate ? formattedDueDate : '-'}</span>
                    {dueDate && (
                        <>
                            <div className='hover-info' style={{ background: backgroundColor }}>
                                <span>{daysLeft} days left</span>
                            </div>
                            <button className='reset-date-btn' onClick={handleResetDate}>
                                <Close size={10} />
                            </button>
                        </>
                    )}
                </div>
            </Dialog>
        </div>
    )
}

export default TaskDatePicker
