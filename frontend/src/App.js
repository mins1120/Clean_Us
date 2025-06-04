// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import KeywordPage from './KeywordPage';
import AddKeywordPage from './AddKeywordPage';
import FeedbackPage from './FeedbackPage';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection';
import MainFunctionSection from './MainFunctionSection';
import FeatureSection from './FeatureSection';
import ReviewSection from './ReviewSection';
import FaqSection from './FaqSection';
import LoginPage from './LoginPage.jsx';
import SignupPage from './SignupPage.jsx';
import Mypage from './Mypage';
import CommentEditPage from './CommentEditPage';
import CommentOffensivePage from './CommentOffensivePage';

import './App.css';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Axios 기본 설정
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
        {/* 로그인/회원가입은 BaseLayout 없이 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* BaseLayout이 적용되는 내부 페이지들 */}
        <Route path="/" element={<BaseLayout />}>
          <Route
            index
            element={
              <>
                <HeroSection />
                <AboutSection />
                <MainFunctionSection />
                <FeatureSection />
                <ReviewSection />
                <FaqSection />
              </>
            }
          />
          <Route path="keywords" element={<KeywordPage />} />
          <Route path="keywords/add" element={<AddKeywordPage />} />
          <Route path="feedbacks" element={<FeedbackPage />} />
          <Route path="mypage" element={<Mypage />} />
          <Route path="comments/edit" element={<CommentEditPage />} />
          <Route path="comments/offensive" element={<CommentOffensivePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
