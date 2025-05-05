// src/AddKeywordPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      // 성공 후 목록 페이지로 되돌아가기
      navigate('/keywords');
    } catch (err) {
      console.error(err);
      setError('추가 중에 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>키워드 추가</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>키워드:&nbsp;
            <input
              type="text"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              required
            />
          </label>
        </div>
        <div style={{ marginTop: 10 }}>
          <label>민감도:&nbsp;
            <select value={sensitive} onChange={e => setSensitive(e.target.value)}>
              <option value={1}>약한 필터링</option>
              <option value={2}>기본 필터링</option>
              <option value={3}>강한 필터링</option>
            </select>
          </label>
        </div>
        <div style={{ marginTop: 20 }}>
          <button type="submit">추가하기</button>
          <button type="button" onClick={() => navigate(-1)} style={{ marginLeft: 10 }}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddKeywordPage;
