import React, { useEffect, useState } from 'react'
import { BreadcrumbLoader } from './BreadcrumbLoader'

export function AiLoader({ isLoading = true }) {
    const [dots, setDots] = useState(1)

    useEffect(() => {
        if (isLoading) {
            const interval = setInterval(() => {
                setDots(prevDots => (prevDots % 3) + 1)
            }, 500)

            return () => clearInterval(interval)
        }
    }, [isLoading])

    if (!isLoading) return null

    return (
        <div className='ai-loading-overlay'>
            <div className='ai-loading-content'>
                <img className='ai-icon' src={'img/OpenAI_Logo.svg'} alt='Loader' />
                <h2 className='ai-title' style={{ display: 'inline-block', position: 'relative' }}>
                    Generating your
                    <span style={{ position: 'absolute', opacity: 1 }}>{'.'.repeat(dots)}</span>
                    <span style={{ visibility: 'hidden' }}>{'...'}</span>
                </h2>
                <BreadcrumbLoader />
            </div>
        </div>
    )
}
