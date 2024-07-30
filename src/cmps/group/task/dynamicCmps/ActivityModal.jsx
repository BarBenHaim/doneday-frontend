import React, { useState, useEffect } from 'react'
import { TabList, Tab, DialogContentContainer } from 'monday-ui-react-core'
import { Close, Home } from 'monday-ui-react-core/icons'
import { ActivityLog } from './Comments/ActivityLog'
import { UpdatedComments } from './Comments/UpdateComments'
import { FilesCmp } from './Comments/FilesCmp'
import { getActivities } from '../../../../store/actions/board.action'

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
}) {
    const [activeTabIndex, setActiveTabIndex] = useState(initialTab)
    const [isClosing, setIsClosing] = useState(false)

    useEffect(() => {
        if (isOpen) {
            setActiveTabIndex(initialTab)
            getActivities(boardId)
        }
    }, [isOpen, initialTab, boardId])

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
            <DialogContentContainer className='activity-modal-popover' style={{ height: '100%', borderRadius: '0' }}>
                <header className='main-header'>
                    <Close className='close-btn' onClick={handleClose} />
                    <h1 className='task-title'>{task.title}</h1>
                </header>
                <TabList
                    className='tabs-container'
                    activeTab={activeTabIndex}
                    onTabChange={setActiveTabIndex}
                    tabType='stretched'
                >
                    <Tab id='update' title='Update View'>
                        <span className='tab-title'>
                            <Home size={16} opacity={0.75} /> Update
                        </span>
                    </Tab>
                    <Tab id='files' title='Files View'>
                        <span className='tab-title'>Files</span>
                    </Tab>
                    <Tab id='activity' title='Activity'>
                        <span className='tab-title'>Activity</span>
                    </Tab>
                    <Tab disabled></Tab>
                    <Tab disabled></Tab>
                    <Tab disabled></Tab>
                    <Tab disabled></Tab>
                </TabList>
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
                    {activeTabIndex === 2 && <ActivityLog activities={activities} users={users} />}
                </div>
            </DialogContentContainer>
        </div>
    )
}

export default ActivityModal
