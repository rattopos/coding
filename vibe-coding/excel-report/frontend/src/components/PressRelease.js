import React, { useState } from 'react';
import './PressRelease.css';

function PressRelease({ content }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="press-release-container">
      <div className="press-release-header">
        <h2>📰 자동 생성 보도자료</h2>
        <button onClick={handleCopy} className="copy-button">
          {copied ? '✓ 복사됨' : '📋 복사하기'}
        </button>
      </div>
      <div className="press-release-content">
        <pre>{content}</pre>
      </div>
    </div>
  );
}

export default PressRelease;

