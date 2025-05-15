import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BaseLayout from './BaseLayout';
import KeywordPage from './KeywordPage';
import AddKeywordPage from './AddKeywordPage';
import FeedbackPage from './FeedbackPage';
import HeroSection from './HeroSection';
import SectionHeading from './SectionHeading';
import MissionSection from './MissionSection';
import './App.css';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
axios.defaults.withCredentials = true;
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

function App() {
  useEffect(() => {
    axios.get('/csrf/').catch(() => {});
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
                <SectionHeading />
                <MissionSection />
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
