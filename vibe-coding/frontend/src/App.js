import React, { useState } from 'react';
import './App.css';
import FileUpload from './components/FileUpload';
import InsightCards from './components/InsightCards';
import PressRelease from './components/PressRelease';
import axios from 'axios';

function App() {
  const [insights, setInsights] = useState(null);
  const [pressRelease, setPressRelease] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError('');
    setInsights(null);
    setPressRelease('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        setInsights(response.data.insights);
        setPressRelease(response.data.press_release);
      }
    } catch (err) {
      setError(err.response?.data?.error || '파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📊 Excel Insights</h1>
        <p>엑셀 데이터를 업로드하고 자동으로 인사이트와 보도자료를 생성하세요</p>
      </header>

      <main className="App-main">
        <FileUpload onFileUpload={handleFileUpload} loading={loading} />

        {error && (
          <div className="error-message">
            <span>⚠️ {error}</span>
          </div>
        )}

        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>데이터를 분석하는 중입니다...</p>
          </div>
        )}

        {insights && !loading && (
          <>
            <InsightCards insights={insights} />
            <PressRelease content={pressRelease} />
          </>
        )}
      </main>

      <footer className="App-footer">
        <p>© 2025 Excel Insights - 데이터 기반 의사결정을 지원합니다</p>
      </footer>
    </div>
  );
}

export default App;

