import React, { useState, useEffect } from 'react'
import { Dialog, DialogContentContainer, Button, Avatar } from 'monday-ui-react-core'
import { cellStyle } from './styleUtils'
import { Attach, File } from 'monday-ui-react-core/icons'
import { makeId } from '../../../../services/util.service'

function TaskFiles({ task, onUpdateField, columnKey }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [fileList, setFileList] = useState(() => {
        const savedFiles = localStorage.getItem(`files-${task._id}-${columnKey}`)
        return savedFiles ? JSON.parse(savedFiles) : task[columnKey] || []
    })
    const [isHovered, setIsHovered] = useState(false)

    const handleFileChange = async event => {
        const files = await Promise.all(
            Array.from(event.target.files).map(async file => {
                const base64 = await fileToBase64(file)
                return {
                    _id: makeId(),
                    filename: file.name,
                    url: base64,
                    type: file.type,
                }
            })
        )
        const updatedFiles = [...fileList, ...files]
        onUpdateField(task, columnKey, updatedFiles)
        setFileList(updatedFiles)
        setIsDialogOpen(false)
        localStorage.setItem(`files-${task._id}-${columnKey}`, JSON.stringify(updatedFiles))
    }

    const handleFileDelete = index => {
        const updatedFiles = fileList.filter((file, fileIndex) => fileIndex !== index)
        onUpdateField(task, columnKey, updatedFiles)
        setFileList(updatedFiles)
        localStorage.setItem(`files-${task._id}-${columnKey}`, JSON.stringify(updatedFiles))
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

    const isImage = filename => {
        return /\.(jpg|jpeg|png|gif)$/i.test(filename)
    }

    const fileToBase64 = file => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
            reader.readAsDataURL(file)
        })
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
                                    {isImage(file.filename) ? (
                                        <img
                                            src={file.url}
                                            alt={file.filename}
                                            style={{ width: '50px', height: '50px', marginInlineEnd: '10px' }}
                                        />
                                    ) : (
                                        <span style={{ marginInlineEnd: '10px' }}>{file.filename}</span>
                                    )}
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
                    <File size={22} style={{ display: isHovered ? 'block' : 'none' }} />
                </div>
            </Dialog>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {fileList.slice(0, 2).map((file, index) => (
                    <Avatar
                        key={index}
                        size={Avatar.sizes.SMALL}
                        type={Avatar.types.IMG}
                        src={file.url}
                        alt={file.filename}
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
