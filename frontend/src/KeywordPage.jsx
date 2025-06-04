// src/KeywordPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './KeywordPage.css';
import { getCookie } from './utils/csrf';

function KeywordPage() {
  const [keywords, setKeywords] = useState([]);

  useEffect(() => {
    axios.defaults.xsrfHeaderName = "X-CSRFToken";
    axios.defaults.withCredentials = true;
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const csrfToken = getCookie('csrftoken');
      const res = await axios.get('http://localhost:8000/preference/keywords/', {
        withCredentials: true,                 
        headers: { 'X-CSRFToken': csrfToken }  
      });
      setKeywords(res.data);
    } catch (err) {
      console.error('키워드 불러오기 실패:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('http://localhost:8000/preference/keywords/', { data: { id } });
      setKeywords(prev => prev.filter(k => k.id !== id));
    } catch (err) {
      console.error('삭제 실패:', err);
    }
  };

  return (
    <div className="keyword-container">
      <h2>내 키워드 필터링 목록</h2>
      <ul className="keyword-list">
        {keywords.map(k => (
          <li key={k.id} className="keyword-item">
            <span className="keyword-item-text">
              <strong>{k.keyword}</strong> (민감도: {k.sensitive})
            </span>
            <button onClick={() => handleDelete(k.id)}>삭제</button>
          </li>
        ))}
      </ul>

      <Link to="/keywords/add">
        <button className="add-button">키워드 추가</button>
      </Link>
    </div>
  );
}

export default KeywordPage;
