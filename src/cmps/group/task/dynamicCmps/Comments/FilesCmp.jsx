import React, { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContentContainer, Button, Avatar } from 'monday-ui-react-core'
import { Attach, File } from 'monday-ui-react-core/icons'

const FilesCmp = ({ task, onUpdateField, columnKey }) => {
    const fileInputRef = useRef(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [fileList, setFileList] = useState(task[columnKey] || [])

    const handleFileChange = event => {
        const files = Array.from(event.target.files)
        const updatedFiles = [...fileList, ...files]
        setFileList(updatedFiles)
        onUpdateField(task, columnKey, updatedFiles)
        setIsDialogOpen(false)
    }

    const handleFileDelete = index => {
        const updatedFiles = fileList.filter((file, fileIndex) => fileIndex !== index)
        setFileList(updatedFiles)
        onUpdateField(task, columnKey, updatedFiles)
    }

    useEffect(() => {
        setFileList(task[columnKey] || [])
    }, [task, columnKey])

    const isImage = file => file.type.startsWith('image/')

    const handleAddFileClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    return (
        <div className='empty-state-container'>
            <img
                className='empty-state-image'
                src='https://cdn.monday.com/images/files-gallery/empty-state.svg'
                alt='empty state'
            />
            <h1 className='add-file-header'>Add files here</h1>
            <p className='add-file-p'>
                Upload, comment and review all files in this item to easily collaborate in context
            </p>
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
                            <input
                                type='file'
                                multiple
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                                ref={fileInputRef}
                            />
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
                                    {isImage(file) ? (
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={file.name}
                                            style={{ width: '50px', height: '50px', marginInlineEnd: '10px' }}
                                        />
                                    ) : (
                                        <span style={{ marginInlineEnd: '10px' }}>{file.name}</span>
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
                <div className='add-files-btn-container'>
                    <button className='add-files-btn' onClick={handleAddFileClick}>
                        + Add file
                    </button>
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

export default FilesCmp
