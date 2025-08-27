// src/FeedbackPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FeedbackPage.css';
import { getCookie } from './utils/csrf';

function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:8000/preference/feedbacks/');
      setFeedbacks(res.data);
    } catch (err) {
      console.error('피드백 불러오기 실패:', err);
      setError('피드백 목록을 불러오는 데 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const csrfToken = getCookie('csrftoken');  // ✅ 이거 사용!
      await axios.delete('http://localhost:8000/preference/feedbacks/',
       {withCredentials: true,
        data: { id },
        headers: { 'X-CSRFToken': csrfToken }});
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error('피드백 삭제 실패:', err);
      setError('피드백 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="feedback-container">
      <h2>내 피드백 목록</h2>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {feedbacks.map((fb) => (
          <li key={fb.id} className="feedback-item">
            <p><strong>댓글 내용:</strong> {fb.comment_content}</p>
            <p><strong>피드백 사유:</strong> {fb.reason}</p>
            <p><strong>제출 시간:</strong> {new Date(fb.submitted_at).toLocaleString()}</p>
            <button onClick={() => handleDelete(fb.id)}>피드백 삭제</button>
          </li>
        ))}
      </ul>
      <button className="back-button" onClick={() => navigate(-1)}>
        뒤로 가기
      </button>
    </div>
  );
}

export default FeedbackPage;
