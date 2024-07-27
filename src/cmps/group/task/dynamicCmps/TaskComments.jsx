import React, { useState } from 'react'
import { AddUpdate } from 'monday-ui-react-core/icons'
import { MsgIcon } from '../../../svgs/TaskSvg'
import ActivityModal from './ActivityModal'

export function TaskComments({ task, members, onUpdateField }) {
  // const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)

  const handleOpenModal = () => {
    setIsCommentsOpen(true)
  }

  const handleCloseModal = () => {
    setIsCommentsOpen(false)
  }

  return (
    <div>
      <ActivityModal
        task={task}
        members={members}
        onUpdateField={onUpdateField}
        isOpen={isCommentsOpen}
        onClose={handleCloseModal}
        initialTab={0} // Ensure it opens on the "Update" tab
      />
      <div
        className="flex align-center justify-center"
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: '0.875em',
          color: '#797A7E',
        }}
        onClick={handleOpenModal}
      >
        {!task.comments || task.comments.length === 0 ? (
          <AddUpdate size={24} />
        ) : (
          <div
            className="flex align-center justify-center"
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
            <span className="msg-count">{task.comments.length}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskComments
