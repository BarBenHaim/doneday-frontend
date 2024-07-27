import React, { useState } from 'react'
import { TabList, Tab } from 'monday-ui-react-core'
import { AddUpdate, Close, Home } from 'monday-ui-react-core/icons'
import { MsgIcon } from '../../../svgs/TaskSvg'
import { ActivityLog } from './Comments/ActivityLog'
import { UpdatedComments } from './Comments/UpdateComments'
import { FilesCmp } from './Comments/FilesCmp'

export function TaskComments({ task, members, onUpdateField }) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  return (
    <section style={{ zIndex: '1000' }}>
      <div className={`comments-container ${isCommentsOpen ? 'open' : ''}`}>
        <header className="main-header">
          <Close
            className="close-btn"
            onClick={() => {
              setIsCommentsOpen(false)
            }}
          />
          <h1 className="task-title">{task.title}</h1>
        </header>
        <div style={{ marginLeft: '27px', padding: '0' }}>
          <TabList
            className="tabs-container"
            activeTab={activeTabIndex}
            onTabChange={setActiveTabIndex}
          >
            <Tab id="update" title="Update View">
              <span
                style={{
                  fontSize: '0.875rem',
                  display: 'flex',
                  gap: '2px',
                  alignItems: 'center',
                }}
              >
                <Home size={16} opacity={0.75} /> Update
              </span>
            </Tab>
            <Tab id="files" title="Files View">
              <span style={{ fontSize: '0.875rem' }}>Files</span>
            </Tab>
            <Tab id="activity" title="Activity">
              <span style={{ fontSize: '0.875rem' }}>Activity</span>
            </Tab>
          </TabList>

          <div className="tab-content" style={{ width: '100%' }}>
            {activeTabIndex === 0 && (
              <UpdatedComments
                task={task}
                onUpdateField={onUpdateField}
                members={members}
              />
            )}
            {activeTabIndex === 1 && <FilesCmp />}
            {activeTabIndex === 2 && <ActivityLog />}
          </div>
        </div>
      </div>
      <div
        className="flex align-center justify-center"
        style={{
          width: '100%',
          textAlign: 'center',
          fontSize: '0.875em',
          color: '#797A7E',
        }}
        onClick={() => {
          setIsCommentsOpen(true)
        }}
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
    </section>
  )
}

export default TaskComments
