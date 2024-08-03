import React, { useState, useEffect } from 'react'
import { TabList, Tab, DialogContentContainer } from 'monday-ui-react-core'
import { Close, Home } from 'monday-ui-react-core/icons'
import { ActivityLog } from './Comments/ActivityLog'
import { UpdatedComments } from './Comments/UpdateComments'
import { FilesCmp } from './Comments/FilesCmp'

export function ActivityModal({
    task,
    boardId,
    groupId,
    loggedinUser,
    onUpdateField,
    isOpen,
    onClose,
    initialTab = 0,
    activities,
    users,
    currBoard,
}) {
    const [activeTabIndex, setActiveTabIndex] = useState(initialTab)
    const [isClosing, setIsClosing] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setActiveTabIndex(initialTab)
        }
    }, [isOpen, initialTab])

    const handleClose = () => {
        setIsClosing(true)
        setTimeout(() => {
            setIsClosing(false)
            onClose()
        }, 300)
    }

    if (!isOpen && !isClosing) return null

    return (
        <div className={`root-activity-modal ${isOpen ? 'open' : 'close'}`}>
            <DialogContentContainer className='activity-modal-popover' size="none" style={{ height: '100%', borderRadius: '0' }}>
                <header className='activity-header'>
                    <div className='header-title' >
                        <div className='am-close-btn'>
                        <Close onClick={handleClose} />
                        </div>
                    <div className='am-task-title'>
                    <h2 className='normal'>{task.title}</h2>
                    </div>
                    </div>
                    <div className='tab-list'>
                    <TabList
                    className='tabs-container'
                    activeTab={activeTabIndex}
                    onTabChange={setActiveTabIndex}
                    tabType='stretched'
                >
                    <Tab id='update' title='Update View'>
                        <span className='am-tab-title'>
                            <Home size={18} opacity={0.75} /> Update
                        </span>
                    </Tab>
                    <Tab id='files' title='Files View'>
                        <span className='am-tab-title'>Files</span>
                    </Tab>
                    <Tab id='activity' title='Activity'>
                        <span className='am-tab-title'>Activity</span>
                    </Tab>
                    <Tab disabled></Tab>
                    <Tab disabled></Tab>
                    <Tab disabled></Tab>
                    <Tab disabled></Tab>
                </TabList>
                    </div>

                </header>
                <div className='tab-content'>
                    {activeTabIndex === 0 && (
                        <UpdatedComments
                            task={task}
                            boardId={boardId}
                            groupId={groupId}
                            onUpdateField={onUpdateField}
                            loggedinUser={loggedinUser}
                        />
                    )}
                    {activeTabIndex === 1 && <FilesCmp task={task} onUpdateField={onUpdateField} columnKey='files' />}
                    {activeTabIndex === 2 && <ActivityLog activities={activities} users={users} currBoard={currBoard} />}
                </div>
            </DialogContentContainer>
        </div>
    )
}

export default ActivityModal
