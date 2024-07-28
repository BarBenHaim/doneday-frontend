import React, { useState, useRef } from 'react'
import { Open } from 'monday-ui-react-core/icons'

const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: '10px',
    boxSizing: 'border-box',
}

const buttonStyle = {
    padding: '5px 10px',
    margin: '5px',
    cursor: 'pointer',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
}

const modalStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: '#fff',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    zIndex: 1000,
}

const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
}

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null
    return (
        <>
            <div style={overlayStyle} onClick={onClose} />
            <div style={modalStyle}>
                <button style={buttonStyle} onClick={onClose}>
                    Close
                </button>
                {children}
            </div>
        </>
    )
}

const TaskRecording = ({ task, onUpdateField, columnKey }) => {
    const [isRecording, setIsRecording] = useState(false)
    const [audioBlob, setAudioBlob] = useState(null)
    const [audioUrl, setAudioUrl] = useState(task[columnKey]?.audioUrl || null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const mediaRecorder = useRef(null)
    const audioChunks = useRef([])

    function startRecording() {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder.current = new MediaRecorder(stream)
                mediaRecorder.current.ondataavailable = event => {
                    audioChunks.current.push(event.data)
                }
                mediaRecorder.current.onstop = () => {
                    const blob = new Blob(audioChunks.current, { type: 'audio/wav' })
                    setAudioBlob(blob)
                    audioChunks.current = []
                }
                mediaRecorder.current.start()
                setIsRecording(true)
            })
            .catch(error => {
                console.error('Error accessing audio devices.', error)
            })
    }

    function stopRecording() {
        mediaRecorder.current.stop()
        setIsRecording(false)
    }

    function saveRecording() {
        const newAudioUrl = URL.createObjectURL(audioBlob)
        onUpdateField(task, columnKey, { audioUrl: newAudioUrl })
        setAudioUrl(newAudioUrl)
        setAudioBlob(null)
    }

    function deleteRecording() {
        setAudioBlob(null)
        setAudioUrl(null)
        onUpdateField(task, columnKey, { audioUrl: null })
    }

    return (
        <div style={containerStyle}>
            {audioUrl ? (
                <button style={{ ...buttonStyle, marginRight: '10px' }} onClick={() => setIsModalOpen(true)}>
                    Play
                </button>
            ) : (
                <div style={{ textAlign: 'center', marginRight: '10px' }}>
                    {isRecording ? (
                        <span>Recording...</span>
                    ) : audioBlob ? (
                        <audio controls>
                            <source src={URL.createObjectURL(audioBlob)} type='audio/wav' />
                            Your browser does not support the audio element.
                        </audio>
                    ) : (
                        <Open />
                    )}
                </div>
            )}
            <div>
                {isRecording ? (
                    <button style={buttonStyle} onClick={stopRecording}>
                        Stop
                    </button>
                ) : (
                    <button style={buttonStyle} onClick={startRecording} disabled={audioUrl}>
                        Start
                    </button>
                )}
                {audioBlob && !audioUrl && (
                    <button style={buttonStyle} onClick={saveRecording}>
                        Save
                    </button>
                )}
                {(audioUrl || audioBlob) && (
                    <button style={buttonStyle} onClick={deleteRecording}>
                        Delete
                    </button>
                )}
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <audio controls style={{ width: '100%' }}>
                    <source src={audioUrl} type='audio/wav' />
                    Your browser does not support the audio element.
                </audio>
            </Modal>
        </div>
    )
}

export default TaskRecording
