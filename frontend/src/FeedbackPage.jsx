import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // CSRF 토큰, 쿠키 설정은 App.js에서 초기화됨
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('/preference/feedbacks/');
      setFeedbacks(res.data);
    } catch (err) {
      console.error('피드백 불러오기 실패:', err);
      setError('피드백 목록을 불러오는 데 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('/preference/feedbacks/', { data: { id } });
      setFeedbacks((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error('피드백 삭제 실패:', err);
      setError('피드백 삭제에 실패했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>내 피드백 목록</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {feedbacks.map((fb) => (
          <li key={fb.id} style={{ marginBottom: '10px' }}>
            <p><strong>댓글 내용:</strong> {fb.comment_content}</p>
            <p><strong>피드백 유형:</strong> {fb.result}</p>
            <p><strong>제출 시간:</strong> {new Date(fb.submitted_at).toLocaleString()}</p>
            <button onClick={() => handleDelete(fb.id)} style={{ marginTop: '5px' }}>
              피드백 삭제
            </button>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>
        뒤로 가기
      </button>
    </div>
  );
}

export default FeedbackPage;
