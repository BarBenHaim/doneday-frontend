import React, { useState, useEffect } from 'react'
import { TabList, Tab } from 'monday-ui-react-core'
import { Close, Home } from 'monday-ui-react-core/icons'
import { ActivityLog } from './Comments/ActivityLog'
import { UpdatedComments } from './Comments/UpdateComments'
import { FilesCmp } from './Comments/FilesCmp'

export function ActivityModal({ task, members, onUpdateField, isOpen, onClose, initialTab = 0 }) {
    const [activeTabIndex, setActiveTabIndex] = useState(initialTab)

    useEffect(() => {
        if (isOpen) setActiveTabIndex(initialTab)
    }, [isOpen, initialTab])

    if (!isOpen) return null

    return (
        <section style={{ zIndex: '1000' }}>
            <div className={`comments-container ${isOpen ? 'open' : ''}`}>
                <header className='main-header'>
                    <Close className='close-btn' onClick={onClose} />
                    <h1 className='task-title'>{task.title}</h1>
                </header>
                <div style={{ marginLeft: '27px', padding: '0' }}>
                    <TabList className='tabs-container' activeTab={activeTabIndex} onTabChange={setActiveTabIndex}>
                        <Tab id='update' title='Update View'>
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
                        <Tab id='files' title='Files View'>
                            <span style={{ fontSize: '0.875rem' }}>Files</span>
                        </Tab>
                        <Tab id='activity' title='Activity'>
                            <span style={{ fontSize: '0.875rem' }}>Activity</span>
                        </Tab>
                    </TabList>

                    <div className='tab-content' style={{ width: '100%' }}>
                        {activeTabIndex === 0 && (
                            <UpdatedComments task={task} onUpdateField={onUpdateField} members={members} />
                        )}
                        {activeTabIndex === 1 && <FilesCmp />}
                        {activeTabIndex === 2 && <ActivityLog />}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ActivityModal
