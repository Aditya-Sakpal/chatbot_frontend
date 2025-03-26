import React, { useState, useEffect } from 'react'
import './index.css'
import { Loader } from 'lucide-react'
import Swal from 'sweetalert2'

const page = () => {
  const [url, setUrl] = useState('');
  const [depth, setDepth] = useState(1);
  const [previousUrls, setPreviousUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentJobId, setCurrentJobId] = useState(null);
  const [statusCheckInterval, setStatusCheckInterval] = useState(null);

  const checkJobStatus = async (jobId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/web_crawl/${jobId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: jobId,
          user_id: localStorage.getItem('user_id')
        })
      });
      const result = await response.json();
      
      if (result.status === 'succeeded') {
        clearInterval(statusCheckInterval);
        setIsLoading(false);
        setCurrentJobId(null);
        Swal.fire({
          title: 'Success',
          text: 'Website crawled successfully',
          icon: 'success'
        });
        setPreviousUrls([...previousUrls, url]);
        setUrl('');
        fetchPreviousCrawls(); // Refresh the list
      } else if (result.status === 'failed') {
        clearInterval(statusCheckInterval);
        setIsLoading(false);
        setCurrentJobId(null);
        Swal.fire({
          title: 'Error',
          text: 'Failed to crawl website',
          icon: 'error'
        });
      }
      // If status is 'pending', continue polling
    } catch (error) {
      console.error('Error checking job status:', error);
      clearInterval(statusCheckInterval);
      setIsLoading(false);
      setCurrentJobId(null);
      Swal.fire({
        title: 'Error',
        text: 'Failed to check crawling status',
        icon: 'error'
      });
    }
  };

  const handleCrawl = async () => {
    if (!url) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/web_crawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url,
          depth: depth,
          user_id: localStorage.getItem('user_id')
        }),
      });
      const result = await response.json();
      
      if (result.job_id) {
        setCurrentJobId(result.job_id);
        // Start polling for job status
        const intervalId = setInterval(() => {
          checkJobStatus(result.job_id);
        }, 15000); // Check every 15 seconds
        setStatusCheckInterval(intervalId);
        
        // Show initial status message
        Swal.fire({
          title: 'Crawling Started',
          text: result.message,
          icon: 'info',
          timer: 3000,
          showConfirmButton: false
        });
      } else {
        setIsLoading(false);
        Swal.fire({
          title: 'Error',
          text: 'Failed to start website crawling',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error('Error starting crawl:', error);
      setIsLoading(false);
      Swal.fire({
        title: 'Error',
        text: 'Failed to start website crawling',
        icon: 'error'
      });
    }
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
      }
    };
  }, [statusCheckInterval]);

  const fetchPreviousCrawls = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fetch_web_crawl_urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_id: localStorage.getItem('user_id')
        }),
      });
      const result = await response.json();
      console.log(result);
      if(result) {
        setPreviousUrls(result.urls);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPreviousCrawls();
  }, []);

  return (
    <div className='web-crawl-container'>
      <div className="web-crawl-left">
        <div className="crawl-input-container">
          <input 
            type="text" 
            placeholder='Enter Website URL' 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            disabled={isLoading}
          />
          <input 
            type="number" 
            placeholder='Crawl Depth' 
            value={depth} 
            onChange={(e) => setDepth(Math.max(1, parseInt(e.target.value) || 1))}
            min="1"
            max="5"
            disabled={isLoading}
            className="depth-input"
          />
          <button 
            onClick={handleCrawl} 
            disabled={isLoading || !url} 
            className={isLoading ? 'loading' : ''}
          >
            Crawl
          </button>
        </div>
        <div className="crawl-loader">
          {isLoading ? (
            <div className="loader-content">
              <Loader className="loader-icon" />
              <p>Crawling website... This might take several minutes</p>
              <p className="sub-text">Job ID: {currentJobId}</p>
            </div>
          ) : (
            <div className="default-message">
              <p>Enter a website URL and set the crawl depth to gather data from multiple pages!</p>
              <p className="sub-text">The chatbot will use the crawled data as reference for its answers</p>
            </div>
          )}
        </div>
      </div>
      <div className="web-crawl-right">
        <p>Previously crawled websites</p>
        <div className="previously-crawled-urls-container">
          {previousUrls.map((url, index) => (
            <p key={index}>{url}</p>
          ))}
        </div>
      </div>
    </div>
  )
}

export default page