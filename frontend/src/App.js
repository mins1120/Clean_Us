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
import Mypage from './Mypage.jsx';  // ✅ 네 로컬 코드
import FilteredCommentPage from './FilteredCommentPage';

import './App.css';             // ✅ 원격 코드
import axios from 'axios';     // ✅ 원격 코드

// ✅ AOS import
import AOS from 'aos';
import 'aos/dist/aos.css';

// axios 기본 설정
axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

function App() {
  // ✅ CSRF 토큰 자동 요청
  useEffect(() => {
    axios.get('/csrf/').catch(() => {});
  }, []);

  // ✅ AOS 애니메이션 초기화
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
    });
    AOS.refresh();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
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
          <Route path="/mypage" element={<Mypage />} /> {/* ✅ 네 추가 코드 */}
          <Route path="/filtered-comments" element={<FilteredCommentPage />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
