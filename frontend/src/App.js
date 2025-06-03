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

// ✅ 댓글 관련 컴포넌트 추가
import CommentEditPage from './CommentEditPage';
import CommentOffensivePage from './CommentOffensivePage';

import './App.css';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';

// axios 설정
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

        {/* ✅ 댓글 페이지 외부에서 독립적으로 연결 */}
        <Route path="/comments/edit" element={<CommentEditPage />} />
        <Route path="/comments/offensive" element={<CommentOffensivePage />} />

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
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/filtered-comments" element={<FilteredCommentPage />} />

        </Route>
      </Routes>
    </Router>
  );
}

export default App;
