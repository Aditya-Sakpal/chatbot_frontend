import React , { useState , useEffect } from 'react'
import './index.css'
import { Loader } from 'lucide-react'
import Swal from 'sweetalert2'

const page = () => {

  const [url , setUrl] = useState('');
  const [previousUrls , setPreviousUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    if (!url) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/scrape_single_url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          url: url,
          user_id: localStorage.getItem('user_id')
        }),
      });
      const result = await response.json();
      if(result){
        Swal.fire({
          title: 'Success',
          text: 'URL uploaded successfully',
          icon: 'success'
        })
        setPreviousUrls([...previousUrls, url]);
        setUrl(''); 
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to upload URL',
          icon: 'error'
        })
      }

    } catch (error) {
      console.log(error);
      alert('Failed to upload URL');
    } finally {
      setIsLoading(false);
    }
  }


  const fetchPreviousUrls = async () => {
    try{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fetch_single_page_urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_id:localStorage.getItem('user_id')
        }),
      });
      const result = await response.json();
      console.log(result)
      if(result){
        setPreviousUrls(result.urls);
      }
    }catch(error){
      console.log(error);
    }
  }

  useEffect(() => {
    fetchPreviousUrls();
  }, []);

  return (
    <>
        <div className='single-page-scrape-container'>
          <div className="single-page-scrape-left">
            <div className="upload-url-container">
              <input type="text" placeholder='Enter URL' value={url} onChange={(e) => setUrl(e.target.value)} disabled={isLoading} />
              <button onClick={handleUpload} disabled={isLoading || !url} className={isLoading ? 'loading' : ''}>Upload</button>
            </div>
            <div className="upload-url-loader">
              {isLoading ? (
                <div className="loader-content">
                  <Loader className="loader-icon" />
                  <p>Processing your URL...</p>
                </div>
              ) : (
                <div className="default-message">
                  <p>Upload a URL and the chatbot will use the website's data as reference for its answers!</p>
                  <p className="sub-text">Supports articles, research papers, and documentation pages</p>
                </div>
              )}
            </div>
          </div>
          <div className="single-page-scrape-right">
            <p>Previously uploaded urls</p>
            <div className="previously-uploaded-urls-container">
              {previousUrls.map((url , index) => (
                <p key={index}>{url}</p>
              ))}
            </div>
          </div>
        </div>
    </>
  )
}

export default page