import React from 'react'

import './index.css'
import Header from '../header/page'
import Body from '../body/page'
import Footer from '../footer/page'

const page = () => {
    return (
        <>
            <div className="chatbot-container" >
                <Header />
                <Body />
                <Footer />
            </div>
        </>
    )
}

export default page