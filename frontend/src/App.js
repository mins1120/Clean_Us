// App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import KeywordPage from './KeywordPage';
import AddKeywordPage from './AddKeywordPage';
import FeedbackPage from './FeedbackPage';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import Mypage from './Mypage';
import FilteredCommentPage from './FilteredCommentPage';
import CommentEditPage from './CommentEditPage';
import CommentOffensivePage from './CommentOffensivePage';
import MainPage from './MainPage'; // ✅ 통합된 메인 페이지
import CommentAnalyzePage from './CommentAnalyzePage'; // ✅ 새로 추가한 AI 분석 페이지
import FindPasswordPage from './FindPasswordPage'; // ✅ 비밀번호 찾기
import ResetPasswordPage from './ResetPasswordPage'; // ✅ 비밀번호 재설정
import './App.css';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

function App() {
  useEffect(() => {
    axios.get('/csrf/').catch(() => {});
  }, []);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false });
    AOS.refresh();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/find-password" element={<FindPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} /> 

          <Route path="/" element={<BaseLayout />}>
          {/* ✅ 통합된 메인 페이지 */}
          <Route index element={<MainPage />} />
          <Route path="keywords" element={<KeywordPage />} />
          <Route path="keywords/add" element={<AddKeywordPage />} />
          <Route path="feedbacks" element={<FeedbackPage />} />
          <Route path="mypage" element={<Mypage />} />
          <Route path="comments/edit" element={<CommentEditPage />} />
          <Route path="comments/offensive" element={<CommentOffensivePage />} />
          <Route path="filtered-comments" element={<FilteredCommentPage />} />

          {/* ✅ 새로 만든 AI 분석 페이지 */}
          <Route path="analyze-comments" element={<CommentAnalyzePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
