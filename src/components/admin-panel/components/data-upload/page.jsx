import { useState } from 'react'

import { File , CircleArrowOutUpLeft , Worm } from 'lucide-react';

import SinglePageScrape from './components/single-page-scrape/page'
import WebCrawl from './components/web-crawl/page'
import DocumentUpload from './components/document-upload/page'
import './index.css'


const page = () => {

    const [selectedOption , setSelectedOption] = useState('Single Web Page');
    
  return (
    <>
        <div className='data-upload-container' >
            <div className="options-bar-container">
                <div className='option' onClick={() => setSelectedOption('Single Web Page')} >
                    <CircleArrowOutUpLeft className='icon' />
                    <p>Single Web Page</p>

                </div>
                <div className='option' onClick={() => setSelectedOption('Web Crawl')} >
                    <Worm className='icon' />
                    <p>Web Crawl</p>
                </div>
                <div className='option' onClick={() => setSelectedOption('Document Upload')} >
                    <File className='icon' />
                    <p>Document Upload</p>
                </div>
            </div>   
            <div  className='data-upload-options-container'>
                {selectedOption === 'Single Web Page' && <SinglePageScrape />}
                {selectedOption === 'Web Crawl' && <WebCrawl />}
                {selectedOption === 'Document Upload' && <DocumentUpload />}
            </div>
        </div>
    </>
)
}

export default page