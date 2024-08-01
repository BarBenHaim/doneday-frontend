import React from 'react'

const Loader = () => {
    return (
        // <section className="container">
        //     <div className='loader'>
        //         <span className='line line1'></span>
        //         <span className='line line2'></span>
        //         <span className='line line3'></span>
        //     </div>
        // </section>
        <section className='container'>
            <div className='loader'>
                <div style={{ '--i': 0 }}></div>
                <div style={{ '--i': 1 }}></div>
                <div style={{ '--i': 2 }}></div>
            </div>
        </section>
    )
}

export default Loader
