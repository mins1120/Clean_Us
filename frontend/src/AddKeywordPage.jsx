// src/AddKeywordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddKeywordPage.css';

function AddKeywordPage() {
  const [keyword, setKeyword] = useState('');
  const [sensitive, setSensitive] = useState(2);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/preference/keywords/add/', {
        keyword,
        sensitive: parseInt(sensitive, 10),
      });
      navigate('/keywords');
    } catch (err) {
      console.error(err);
      setError('추가 중에 오류가 발생했습니다.');
    }
  };

  return (
    <div className="add-keyword-container">
      <h2>키워드 추가</h2>
      {error && <p className="error-message">{error}</p>}
      <form className="add-keyword-form" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="keyword">키워드</label>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="sensitive">민감도</label>
          <select
            id="sensitive"
            value={sensitive}
            onChange={(e) => setSensitive(e.target.value)}
          >
            <option value={1}>약한 필터링</option>
            <option value={2}>기본 필터링</option>
            <option value={3}>강한 필터링</option>
          </select>
        </div>

        <div className="button-group">
          <button type="submit">추가하기</button>
          <button type="button" onClick={() => navigate(-1)}>취소</button>
        </div>
      </form>
    </div>
  );
}

export default AddKeywordPage;
