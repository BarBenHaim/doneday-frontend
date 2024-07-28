import React, { useState, useRef, useEffect } from 'react'
import { Microphone, Open, Play } from 'monday-ui-react-core/icons'
import { Dialog, DialogContentContainer, Button } from 'monday-ui-react-core'

const TaskRecording = ({ task, onUpdateField, columnKey }) => {
    const [isRecording, setIsRecording] = useState(false)
    const [audioBlob, setAudioBlob] = useState(null)
    const [audioUrl, setAudioUrl] = useState(task[columnKey]?.audioUrl || null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const mediaRecorder = useRef(null)
    const audioChunks = useRef([])
    const audioRef = useRef(null)

    useEffect(() => {
        if (isRecording) {
            startRecording()
        } else if (mediaRecorder.current) {
            mediaRecorder.current.stop()
        }
    }, [isRecording])

    useEffect(() => {
        if (isModalOpen && audioRef.current) {
            audioRef.current.play()
        }
    }, [isModalOpen])

    function startRecording() {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(stream => {
                const options = { mimeType: 'audio/webm;codecs=opus' }
                mediaRecorder.current = new MediaRecorder(stream, options)
                mediaRecorder.current.ondataavailable = event => {
                    audioChunks.current.push(event.data)
                }
                mediaRecorder.current.onstop = () => {
                    const blob = new Blob(audioChunks.current, { type: 'audio/webm' })
                    setAudioBlob(blob)
                    audioChunks.current = []
                    saveRecording(blob)
                }
                mediaRecorder.current.start()
            })
            .catch(error => {
                console.error('Error accessing audio devices.', error)
            })
    }

    function stopRecording() {
        setIsRecording(false)
    }

    function saveRecording(blob) {
        const newAudioUrl = URL.createObjectURL(blob)
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
        <Dialog
            zIndex={3}
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            content={
                <DialogContentContainer style={{ width: '250px' }}>
                    <audio controls style={{ width: '100%' }} ref={audioRef} autoplay>
                        <source src={audioUrl} type='audio/webm' />
                        Your browser does not support the audio element.
                    </audio>
                    {audioUrl && (
                        <Button onClick={deleteRecording} size='small' kind='secondary'>
                            Delete
                        </Button>
                    )}
                </DialogContentContainer>
            }
            hideTrigger={['clickoutside', 'onContentClick']}
            position='bottom'
            showTrigger={['click']}
        >
            <div className='flex align-center' style={{ cursor: 'pointer', width: '100%', justifyContent: 'center' }}>
                {audioUrl ? (
                    <Play onClick={() => setIsModalOpen(true)} style={{ color: 'grey' }} />
                ) : (
                    <>
                        {isRecording ? (
                            <>
                                <div
                                    className='in-recording-container flex align-center'
                                    style={{ justifyContent: 'space-between', gap: '5px' }}
                                >
                                    <span style={{ fontSize: '0.8rem' }}>Recording...</span>
                                    <button onClick={stopRecording} style={{ color: 'red', fontSize: '0.8rem' }}>
                                        Stop
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Microphone onClick={() => setIsRecording(true)} style={{ color: 'grey' }} />
                        )}
                    </>
                )}
            </div>
        </Dialog>
    )
}

export default TaskRecording
