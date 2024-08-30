import React, { useEffect, useState } from 'react'
import { BreadcrumbLoader } from './BreadcrumbLoader'

export function AiLoader({ isLoading = true }) {
    const [dots, setDots] = useState(1)
    const [loadedImage, setLoadedImage] = useState(null)

    useEffect(() => {
        const img = new Image()
        img.src = 'img/OpenAI_Logo.svg'
        img.onload = () => setLoadedImage(img)
    }, [])

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
                {loadedImage && (
                    <img
                        className='ai-icon'
                        src={loadedImage.src}
                        alt='Loader'
                        style={{ opacity: isLoading ? 0.9 : 0 }}
                    />
                )}
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
