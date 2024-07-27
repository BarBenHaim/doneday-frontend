import React from 'react'
import { AddUpdate } from 'monday-ui-react-core/icons'
import { MsgIcon } from '../../svgs/TaskSvg'

export function TaskCommentsIcon({ task, onOpen }) {
    return (
        <div
            className='flex align-center justify-center'
            style={{
                width: '100%',
                textAlign: 'center',
                fontSize: '0.875em',
                color: '#797A7E',
            }}
            onClick={onOpen}
        >
            {!task.comments || task.comments.length === 0 ? (
                <AddUpdate size={24} />
            ) : (
                <div
                    className='flex align-center justify-center'
                    style={{
                        width: '100%',
                        textAlign: 'center',
                        fontSize: '0.875em',
                        color: '#797A7E',
                        position: 'relative',
                        display: 'inline-block',
                    }}
                >
                    <MsgIcon size={30} />
                    <span className='msg-count'>{task.comments.length}</span>
                </div>
            )}
        </div>
    )
}

export default TaskCommentsIcon
