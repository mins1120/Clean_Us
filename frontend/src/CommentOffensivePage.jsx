import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CommentOffensivePage() {
  const [offensiveComments, setOffensiveComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    axios.get(`${BASE_URL}/api/comments/offensive/`, { withCredentials: true })
      .then(response => {
        setOffensiveComments(response.data.offensive_comments);
      })
      .catch(error => {
        console.error('악성 댓글 불러오기 실패:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2>악성 댓글 목록</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : offensiveComments.length === 0 ? (
        <p>⚠️ 악성 댓글이 없습니다.</p>
      ) : (
        <ul>
          {offensiveComments.map(comment => (
            <li key={comment.id}>
              <strong>{comment.author || '익명'}:</strong> {comment.content}
              <span style={{ color: 'red' }}> (악성: {comment.offensive_keyword})</span>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{comment.created_at}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentOffensivePage;