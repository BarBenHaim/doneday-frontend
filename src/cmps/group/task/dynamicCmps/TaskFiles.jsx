import React, { useState, useEffect } from 'react'
import { Dialog, DialogContentContainer, Button, Avatar } from 'monday-ui-react-core'
import { cellStyle } from './styleUtils'

function TaskFiles({ task, onUpdateField }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [fileList, setFileList] = useState(task.files || [])

    const handleFileChange = event => {
        const files = Array.from(event.target.files)
        const updatedFiles = [...fileList, ...files]
        onUpdateField(task, 'files', updatedFiles)
        setFileList(updatedFiles)
        setIsDialogOpen(false)
    }

    const handleFileDelete = index => {
        const updatedFiles = fileList.filter((file, fileIndex) => fileIndex !== index)
        onUpdateField(task, 'files', updatedFiles)
        setFileList(updatedFiles)
    }

    useEffect(() => {
        setFileList(task.files || [])
    }, [task.files])

    return (
        <div style={cellStyle}>
            <Dialog
                zIndex={2}
                isOpen={isDialogOpen}
                onDialogDidHide={() => setIsDialogOpen(false)}
                content={
                    <DialogContentContainer>
                        <input
                            type='file'
                            multiple
                            onChange={handleFileChange}
                            style={{ display: 'block', marginBottom: '10px' }}
                        />
                        <ul>
                            {fileList.map((file, index) => (
                                <li
                                    key={index}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    {file.name}
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
                <div style={{ width: '100%', textAlign: 'center' }} onClick={() => setIsDialogOpen(true)}>
                    +
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
