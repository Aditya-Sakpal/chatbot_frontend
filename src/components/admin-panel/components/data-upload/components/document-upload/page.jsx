import React, { useState, useEffect } from 'react'
import './index.css'
import { Loader, Upload } from 'lucide-react'
import Swal from 'sweetalert2'

const Page = () => {
  const [files, setFiles] = useState([]);
  const [previousDocuments, setPreviousDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'application/epub+zip'
  ];

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    // Check file types
    const invalidFiles = selectedFiles.filter(file => !allowedTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      Swal.fire({
        title: 'Invalid File Type',
        text: 'Please upload only PDF, DOCX, TXT, or EPUB files',
        icon: 'error'
      });
      return;
    }

    // Check total files limit
    if (selectedFiles.length > 5) {
      Swal.fire({
        title: 'Too Many Files',
        text: 'You can upload maximum 5 documents at once',
        icon: 'warning'
      });
      return;
    }

    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsLoading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('user_id', localStorage.getItem('user_id'));

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload_documents`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();
      if (result) {
        Swal.fire({
          title: 'Success',
          text: 'Documents uploaded successfully',
          icon: 'success'
        });
        setFiles([]);
        fetchPreviousDocuments();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Failed to upload documents',
          icon: 'error'
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to upload documents',
        icon: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPreviousDocuments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/fetch_documents`, {
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
      if (result) {
        setPreviousDocuments(result.documents);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPreviousDocuments();
  }, []);

  return (
    <div className='document-upload-container'>
      <div className="document-upload-left">
        <div className="upload-document-container">
          <input
            type="file"
            multiple
            accept=".pdf,.docx,.txt,.epub"
            onChange={handleFileChange}
            disabled={isLoading}
            id="file-input"
            className="file-input"
          />
          <label htmlFor="file-input" className="file-input-label">
            <Upload className="upload-icon" />
            <span>Choose Files</span>
          </label>
          <button
            onClick={handleUpload}
            disabled={isLoading || files.length === 0}
            className={isLoading ? 'loading' : ''}
          >
            Upload
          </button>
        </div>
        <div className="upload-document-loader">
          {isLoading ? (
            <div className="loader-content">
              <Loader className="loader-icon" />
              <p>Processing your documents...</p>
            </div>
          ) : (
            <div className="default-message">
              {files.length > 0 ? (
                <div className="selected-files">
                  <p>Selected Documents:</p>
                  {files.map((file, index) => (
                    <p key={index} className="file-name">{file.name}</p>
                  ))}
                </div>
              ) : (
                <>
                  <p>Upload documents and the chatbot will use their content as reference for its answers!</p>
                  <p className="sub-text">Supports PDF, DOCX, TXT, and EPUB files (Max 5 files)</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="document-upload-right">
        Previously uploaded documents
        <div className="previously-uploaded-documents-container">
          {previousDocuments.map((doc, index) => (
            <p key={index} className="document-item">
              {doc}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;