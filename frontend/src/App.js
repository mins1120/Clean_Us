// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import KeywordPage from './KeywordPage';
import AddKeywordPage from './AddKeywordPage';
import FeedbackPage from './FeedbackPage';
import './App.css';
import axios from 'axios';
import React, { useEffect } from 'react'


axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

function HomePage() {
  return (
    <>
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
    </>
  );
}

function App() {
  useEffect(() => {
    // CSRF 쿠키 발급용 빈 GET 요청
    axios.get('/csrf/').catch(() => {
      /* CSRF 쿠키 가져오기 실패 무시 */
    });
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route index element={<HomePage />} />
          <Route path="keywords" element={<KeywordPage />} />
          <Route path="keywords/add" element={<AddKeywordPage />} />
          <Route path="feedbacks" element={<FeedbackPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
