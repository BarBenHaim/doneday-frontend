import React, { useEffect, useState } from 'react'

export function BreadcrumbLoader() {
    const steps = ['Building Board', 'Groups', 'Tasks']
    const [activeStep, setActiveStep] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveStep(prev => (prev + 1) % steps.length)
        }, 1500)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className='breadcrumb-container'>
            {steps.map((step, index) => (
                <div
                    key={index}
                    className={`breadcrumb-step ${index <= activeStep ? 'isActive' : ''} ${
                        index < activeStep ? 'completed' : ''
                    }`}
                >
                    {step}
                </div>
            ))}
        </div>
    )
}
