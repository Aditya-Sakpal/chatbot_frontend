import './index.css'
import { useEffect, useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, PieChart, Pie, BarChart, Bar, Cell, CartesianGrid, Legend } from 'recharts'
import { Save, FileDown, Mail } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { motion, AnimatePresence } from 'framer-motion';

const Page = () => {

  const [queryHistory, setQueryHistory] = useState([])
  const [selectedQuery, setSelectedQuery] = useState(null)
  const [popupOpen, setPopupOpen] = useState(false)
  const [bubbleData, setBubbleData] = useState([])
  const [articleDetails, setArticleDetails] = useState([])
  const [selectedArticles, setSelectedArticles] = useState([]) // State for selected articles
  const [isEmailSending, setIsEmailSending] = useState(false)
  const [showDescriptiveAnalysis, setShowDescriptiveAnalysis] = useState(false);
  const [pieChartData, setPieChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [isSliding, setIsSliding] = useState(false);
  const [successMessages, setSuccessMessages] = useState({
    save: '',
    download: '',
    email: ''
  });

  const countUniqueQueryIds = (data) => {
    const uniqueQueryIds = new Set();
  
    data.forEach(innerArray => {
      if (innerArray.length > 6) {
        uniqueQueryIds.add(innerArray[6]); // Assuming query_id is at index 6
      }
    });
  
    return uniqueQueryIds.size;
  };
  

  const fetchQueryHistory = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/query_history`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id")
        })
      })
      const data = await response.json()
      const uniqueQueryCount = countUniqueQueryIds(data.message)
      console.log(data)
      setQueryHistory(data.message)
    } catch (error) {
      console.error("Error fetching query history:", error)
      setQueryHistory([])
    }
  }

  const bubbleGraphDetails = async (query_id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/bubble_graph_details`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          query_id: query_id
        })
      })
      const data = await response.json()
      console.log(data)

      const formattedData = data.modality_count.map((item, index) => ({
        x: index + 1,
        y: item[1],
        z: item[1] * 5,
        modality: item[0]
      }))

      setBubbleData(formattedData)
      setArticleDetails(data.articles_details)
      setSelectedArticles([]) // Reset selected articles when opening new popup

    } catch (error) {
      console.error("Error fetching bubble graph details:", error)
    }
  }

  const openPopup = (index) => {
    setSelectedQuery(queryHistory[index])
    bubbleGraphDetails(queryHistory[index][6])
    setPopupOpen(true)
  }

  const closePopup = (e) => {
    if (e.target.classList.contains('popup-container')) {
      setPopupOpen(false)
      setSelectedArticles([]) // Clear selected articles when closing popup
    }
  }

  const handleCheckboxChange = (articleId) => {
    setSelectedArticles((prevSelected) =>
      prevSelected.includes(articleId)
        ? prevSelected.filter((id) => id !== articleId) // Remove if unchecked
        : [...prevSelected, articleId] // Add if checked
    )
  }

  // Helper function to show success message temporarily
  const showSuccessMessage = (type, message) => {
    setSuccessMessages(prev => ({ ...prev, [type]: message }));
    setTimeout(() => {
      setSuccessMessages(prev => ({ ...prev, [type]: '' }));
    }, 3000); // Message disappears after 3 seconds
  };

  const handleSave = async () => {
    if (selectedArticles.length === 0) return;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/save_articles`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          article_ids: selectedArticles
        })
      });
      const data = await response.json();
      showSuccessMessage('save', 'Saved successfully');
    } catch (error) {
      console.error("Error saving articles:", error);
    }
  };

  const fetchDescriptiveAnalysis = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_descriptive_analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query_id: selectedQuery[6]
        })
      });
      const data = await response.json();

      // Format pie chart data
      const pieData = data.pie_chart.categories.map((category, index) => ({
        name: category,
        value: data.pie_chart.values[index]
      }));

      // Format bar chart data
      const barData = data.bar_chart.labels.map((label, index) => ({
        name: label,
        value: data.bar_chart.values[index]
      }));

      setPieChartData(pieData);
      setBarChartData(barData);
      setIsSliding(true);
      setTimeout(() => {
        setShowDescriptiveAnalysis(true);
        setIsSliding(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching descriptive analysis:', error);
    }
  };

  const handleMoveToDescriptive = () => {
    fetchDescriptiveAnalysis();
  };

  const handleMoveToBubble = () => {
    setIsSliding(true);
    setTimeout(() => {
      setShowDescriptiveAnalysis(false);
      setIsSliding(false);
    }, 500);
  };

  const handleSaveAnalysis = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/save_analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: localStorage.getItem("user_id"),
          pie_chart: pieChartData,
          bar_chart: barChartData
        })
      });
      alert('Analysis saved successfully!');
    } catch (error) {
      console.error('Error saving analysis:', error);
      alert('Failed to save analysis');
    }
  };

  const createAnalysisPDF = async () => {
    const pdf = new jsPDF();

    // Capture pie chart
    const pieChartElement = document.querySelector('.pie-chart-container');
    const pieCanvas = await html2canvas(pieChartElement);
    const pieImage = pieCanvas.toDataURL('image/png');

    // Capture bar chart
    const barChartElement = document.querySelector('.bar-chart-container');
    const barCanvas = await html2canvas(barChartElement);
    const barImage = barCanvas.toDataURL('image/png');

    // Add charts to PDF
    pdf.text('Descriptive Analysis', 20, 20);
    pdf.addImage(pieImage, 'PNG', 20, 30, 170, 100);
    pdf.addPage();
    pdf.text('Comparison Analysis', 20, 20);
    pdf.addImage(barImage, 'PNG', 20, 30, 170, 100);

    return pdf;
  };

  const handleDownload = async () => {
    if (selectedArticles.length === 0) return;

    try {
      // 1. Get articles data from API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_articles_abstract`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          article_ids: selectedArticles
        })
      });
      const articlesData = await response.json();

      // 2. Capture bubble chart as image
      const chartElement = document.querySelector('.bubble-chart-container');
      const canvas = await html2canvas(chartElement);
      const chartImage = canvas.toDataURL('image/png');

      // 3. Create PDF
      const pdf = new jsPDF();

      // Add title to first page
      pdf.setFontSize(16);
      pdf.text('Bubble Chart Analysis', 20, 20);

      // Add bubble chart to first page
      pdf.addImage(chartImage, 'PNG', 20, 30, 170, 100);

      // Add articles data to subsequent pages
      articlesData.data.forEach((article, index) => {
        // Add new page for each article
        if (index > 0) {
          pdf.addPage();
        } else {
          pdf.addPage(); // Add page after bubble chart
        }

        // Article title
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Article Title:', 20, 20);

        // Handle long titles with text wrapping
        const titleLines = pdf.splitTextToSize(article.article_title, 170);
        pdf.setFont(undefined, 'normal');
        pdf.text(titleLines, 20, 30);

        // Article abstract
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Abstract:', 20, 50 + (titleLines.length - 1) * 10);

        // Handle long abstract with text wrapping
        pdf.setFont(undefined, 'normal');
        const abstractLines = pdf.splitTextToSize(article.abstract, 170);
        pdf.text(abstractLines, 20, 60 + (titleLines.length - 1) * 10);
      });

      // Download PDF
      pdf.save('bubble-chart-analysis.pdf');
      showSuccessMessage('download', 'Download completed');

    } catch (error) {
      console.error("Error downloading articles:", error);
    }
  };

  const handleEmail = async () => {
    if (selectedArticles.length === 0) return;

    try {
      // 1. Get articles data from API
      const response = await fetch(`${import.meta.env.VITE_API_URL}/get_articles_abstract`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({
          article_ids: selectedArticles
        })
      });
      const articlesData = await response.json();

      // 2. Capture bubble chart as image
      const chartElement = document.querySelector('.bubble-chart-container');
      const canvas = await html2canvas(chartElement);
      const chartImage = canvas.toDataURL('image/png');

      // 3. Create PDF
      const pdf = new jsPDF();

      // Add title to first page
      pdf.setFontSize(16);
      pdf.text('Bubble Chart Analysis', 20, 20);

      // Add bubble chart to first page
      pdf.addImage(chartImage, 'PNG', 20, 30, 170, 100);

      // Add articles data to subsequent pages
      articlesData.data.forEach((article, index) => {
        if (index > 0 || index === 0) {
          pdf.addPage();
        }

        // Article title
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text('Article Title:', 20, 20);

        const titleLines = pdf.splitTextToSize(article.article_title, 170);
        pdf.setFont(undefined, 'normal');
        pdf.text(titleLines, 20, 30);

        // Article abstract
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Abstract:', 20, 50 + (titleLines.length - 1) * 10);

        pdf.setFont(undefined, 'normal');
        const abstractLines = pdf.splitTextToSize(article.abstract, 170);
        pdf.text(abstractLines, 20, 60 + (titleLines.length - 1) * 10);
      });

      // Convert PDF to Blob
      const pdfBlob = pdf.output('blob');

      // Create FormData and append the file
      const formData = new FormData();
      formData.append('pdf_file', pdfBlob, 'bubble-chart-analysis.pdf');
      formData.append('user_id', localStorage.getItem("user_id"));
      formData.append('query', selectedQuery[9]);

      // 4. Send PDF to backend
      const emailResponse = await fetch(`${import.meta.env.VITE_API_URL}/send_email`, {
        method: 'POST',
        body: formData, // No need to set Content-Type header, browser will set it automatically with boundary
      });

      const emailResult = await emailResponse.json();

      if (emailResult.success) {
        showSuccessMessage('email', 'Email sent successfully');
      } else {
        throw new Error(emailResult.message || 'Failed to send email');
      }

    } catch (error) {
      console.error("Error sending email:", error);
      alert('Failed to send email. Please try again.');
    }
  };

  useEffect(() => {
    fetchQueryHistory()
  }, [])


  return (
    <div className='query-history-container'>
      <div className='query-history-container-inner'>
        <h1>Query History</h1>
      </div>
      {popupOpen && selectedQuery && (
        <div className='popup-container' onClick={closePopup}>
          <div className='popup-content'>
            <div className='popup-content-top'>
              <div className='popup-content-top-title'>
                <h1>{showDescriptiveAnalysis ? 'Descriptive Analysis' : 'Bubble Chart Analysis'}</h1>
              </div>
              <div className="options-container">
                <div className={`option-container ${selectedArticles.length === 0 ? 'disabled' : ''}`}>
                  {successMessages.save && <span className="success-message">{successMessages.save}</span>}
                  <div className="option-inner" onClick={handleSave}>
                    <Save className='icon' />
                    <p>Save</p>
                  </div>
                </div>
                <div className={`option-container ${selectedArticles.length === 0 ? 'disabled' : ''}`}>
                  {successMessages.download && <span className="success-message">{successMessages.download}</span>}
                  <div className="option-inner" onClick={handleDownload}>
                    <FileDown className='icon' />
                    <p>Download</p>
                  </div>
                </div>
                <div className={`option-container ${selectedArticles.length === 0 ? 'disabled' : ''}`}>
                  {successMessages.email && <span className="success-message">{successMessages.email}</span>}
                  <div className="option-inner" onClick={handleEmail}>
                    <Mail className='icon' />
                    <p>Email</p>
                  </div>
                </div>
              </div>
            </div>
            <AnimatePresence>
              <motion.div
                className='popup-content-bottom'
                initial={{ x: isSliding ? (showDescriptiveAnalysis ? '100%' : '-100%') : 0 }}
                animate={{ x: 0 }}
                exit={{ x: isSliding ? (showDescriptiveAnalysis ? '-100%' : '100%') : 0 }}
                transition={{ duration: 0.5 }}
              >
                {!showDescriptiveAnalysis ? (
                  <>
                    <div className='popup-content-left'>
                      <h3>Modality Bubble Chart</h3>
                      <div className='bubble-chart-container'>
                        <ResponsiveContainer width="100%" height="100%">
                          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                            <XAxis
                              type="number"
                              dataKey="x"
                              name="Index"
                              tick={{ fill: '#666' }}
                              stroke="#ccc"
                            />
                            <YAxis
                              type="number"
                              dataKey="y"
                              name="Frequency"
                              tick={{ fill: '#666' }}
                              stroke="#ccc"
                            />
                            <ZAxis type="number" dataKey="z" range={[50, 400]} />
                            <Tooltip
                              cursor={{ strokeDasharray: '3 3' }}
                              content={({ payload }) => {
                                if (payload && payload.length > 0) {
                                  const data = payload[0].payload;
                                  return (
                                    <div style={{
                                      backgroundColor: 'white',
                                      padding: '10px',
                                      border: 'none',
                                      borderRadius: '4px',
                                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                                    }}>
                                      <p style={{ margin: 0 }}><strong>{data.modality}</strong></p>
                                      <p style={{ margin: '5px 0 0 0' }}>Frequency: {data.y}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Scatter
                              data={bubbleData}
                              fill="#8884d8"
                              fillOpacity={0.7}
                              name="Modality Count"
                            />
                          </ScatterChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className='popup-content-right'>
                      <h2>Query: {selectedQuery[9]}</h2>
                      <h3>Related Articles</h3>
                      <div className='article-details-container'>
                        {articleDetails.length > 0 ? (
                          <div className='article-details-container-inner'>
                            {articleDetails.map((article, index) => (
                              <div className='article-details-container-inner-div' key={index}>
                                <div className='article-details-container-inner-div-title'>{article.article_title}</div>
                                <div className='article-details-container-inner-div-checkbox'>
                                  <input
                                    type="checkbox"
                                    checked={selectedArticles.includes(article.article_id)}
                                    onChange={() => handleCheckboxChange(article.article_id)}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p>No articles found.</p>
                        )}
                      </div>
                      <button
                        className="move-button"
                        onClick={handleMoveToDescriptive}
                      >
                        Move to Descriptive Analysis
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className='popup-content-left'>
                      <h3>Pie Chart</h3>
                      <div className='pie-chart-container'>
                        <ResponsiveContainer width="100%" height='100%'>
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label
                            >
                              {pieChartData?.map((entry, index) => (
                                <Cell key={index} fill={`#${Math.floor(Math.random() * 16777215).toString(16)}`} />
                              ))}
                            </Pie>
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className='popup-content-right'>
                      <h3>Bar Graph</h3>
                      <div className='bar-chart-container'>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={barChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <button
                      className="move-button"
                      onClick={handleMoveToBubble}
                    >
                      Move to Bubble Graph
                    </button>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {queryHistory.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Query</th>
              <th>Modality</th>
              <th>Organ</th>
              <th>Disease</th>
              <th>Result</th>
              <th>Article</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {queryHistory.map((row, index) => (
              <tr key={index} onClick={() => openPopup(index)}>
                <td>{row[9]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
                <td>{row[8]}</td>
                <td>{row[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No query history found.</p>
      )}
    </div>
  )
}

export default Page
