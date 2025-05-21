import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import KeywordPage from './KeywordPage';
import AddKeywordPage from './AddKeywordPage';
import FeedbackPage from './FeedbackPage';
import HeroSection from './HeroSection';
import AboutSection from './AboutSection'; // ✅ 새로운 컴포넌트
import MainFunctionSection from './MainFunctionSection';
import FeatureSection from './FeatureSection';
import ReviewSection from './ReviewSection';
import FaqSection from './FaqSection';
import './App.css';
import axios from 'axios';

// ✅ AOS import
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
    AOS.init({
      duration: 1000,
      once: false,
    });
    AOS.refresh();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<BaseLayout />}>
          <Route
            index
            element={
              <>
                <HeroSection />
                <AboutSection /> {/* ✅ 섹션 통합 */}
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
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
