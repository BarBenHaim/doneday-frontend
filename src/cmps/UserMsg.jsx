import { useState, useEffect, useRef, useMemo } from 'react'
import { eventBus, showSuccessMsg } from '../services/event-bus.service'
import { socketService, SOCKET_EVENT_REVIEW_ABOUT_YOU } from '../services/socket.service'
import { Toast } from 'monday-ui-react-core'

export function UserMsg() {
    const [msg, setMsg] = useState(null)
    const timeoutIdRef = useRef()

    useEffect(() => {
        const unsubscribe = eventBus.on('show-msg', msg => {
            setMsg(msg)
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current)
                timeoutIdRef.current = null
            }
            timeoutIdRef.current = setTimeout(closeMsg, 3000)
        })

        socketService.on(SOCKET_EVENT_REVIEW_ABOUT_YOU, review => {
            showSuccessMsg(`New review about me ${review.txt}`)
        })

        return () => {
            unsubscribe()
            socketService.off(SOCKET_EVENT_REVIEW_ABOUT_YOU)
        }
    }, [])

    function closeMsg() {
        setMsg(null)
    }

    const actions = useMemo(() => [], [])
    return (
        <>
            {msg && (
                <div style={{ zIndex: '10' }}>
                    <Toast
                        open
                        type={msg.type === 'error' ? Toast.types.NEGATIVE : Toast.types.POSITIVE}
                        actions={actions}
                        autoHideDuration={5000}
                        className='user-msg-monday'
                        onClose={closeMsg}
                    >
                        {msg.txt}
                    </Toast>
                </div>
            )}
        </>
    )
}
