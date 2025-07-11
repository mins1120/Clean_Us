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
import Mypage from './Mypage.jsx';
import FilteredCommentPage from './FilteredCommentPage';
import CommentEditPage from './CommentEditPage';
import CommentOffensivePage from './CommentOffensivePage';
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
          <Route path="filtered-comments" element={<FilteredCommentPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
