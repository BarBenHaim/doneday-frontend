import React, { useState, useEffect } from 'react'
import { Dialog, DialogContentContainer, Button, Avatar } from 'monday-ui-react-core'
import { cellStyle } from './styleUtils'
import { Attach, File } from 'monday-ui-react-core/icons'

function TaskFiles({ task, onUpdateField, columnKey }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [fileList, setFileList] = useState(task[columnKey] || [])
    const [isHovered, setIsHovered] = useState(false)

    const handleFileChange = event => {
        const files = Array.from(event.target.files)
        const updatedFiles = [...fileList, ...files]
        onUpdateField(task, columnKey, updatedFiles)
        setFileList(updatedFiles)
        setIsDialogOpen(false)
    }

    const handleFileDelete = index => {
        const updatedFiles = fileList.filter((file, fileIndex) => fileIndex !== index)
        onUpdateField(task, columnKey, updatedFiles)
        setFileList(updatedFiles)
    }

    useEffect(() => {
        setFileList(task[columnKey] || [])
    }, [task[columnKey]])

    const handleMouseEnter = () => {
        setIsHovered(true)
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
    }

    return (
        <div style={cellStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Dialog
                zIndex={3}
                isOpen={isDialogOpen}
                onDialogDidHide={() => setIsDialogOpen(false)}
                content={
                    <DialogContentContainer style={{ padding: '0 2px' }}>
                        <label style={{ fontSize: '0.8em', cursor: 'pointer' }}>
                            <span style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                                <Attach size={18} /> from computer
                            </span>
                            <input type='file' multiple onChange={handleFileChange} style={{ display: 'none' }} />
                        </label>
                        <ul>
                            {fileList.map((file, index) => (
                                <li
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '10px',
                                    }}
                                >
                                    <span style={{ marginInlineEnd: '10px' }}>{file.name}</span>
                                    <Button onClick={() => handleFileDelete(index)} size='small' kind='secondary'>
                                        Delete
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </DialogContentContainer>
                }
                hideTrigger={['clickoutside']}
                position='bottom'
                showTrigger={['click']}
            >
                <div className='flex align-center justify-center' style={{ cursor: 'pointer', color: '#acaeb6' }}>
                    {<File size={22} style={{ opacity: isHovered ? '.7' : '0' }} />}
                </div>
            </Dialog>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {fileList.slice(0, 2).map((file, index) => (
                    <Avatar
                        key={index}
                        size={Avatar.sizes.SMALL}
                        type={Avatar.types.IMG}
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                    />
                ))}
                {fileList.length > 2 && (
                    <Avatar size={Avatar.sizes.SMALL} type={Avatar.types.TEXT} text={`+${fileList.length - 2}`} />
                )}
            </div>
        </div>
    )
}

export default TaskFiles
