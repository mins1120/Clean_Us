// App.js
import React from 'react';
import BaseLayout from './BaseLayout';
import './App.css';

function App() {
  return (
    <BaseLayout>
      <header className="hero">
        <h1>Clean Us</h1>
        <p>AI 기반 악성 댓글 실시간 탐지 및 정화 서비스</p>
      </header>

      <section className="features">
        <div className="feature-card">
          <h2>실시간 댓글 분석</h2>
          <p>AI가 실시간으로 악성 댓글을 감지하고 차단합니다.</p>
        </div>
        <div className="feature-card">
          <h2>관리 페이지</h2>
          <p>악성 댓글 확인, 피드백, 키워드 설정 등을 관리할 수 있어요.</p>
        </div>
        <div className="feature-card">
          <h2>사용자 피드백</h2>
          <p>감지된 댓글에 대한 정확성을 사용자에게서 직접 받습니다.</p>
        </div>
      </section>
    </BaseLayout>
  );
}

export default App;
