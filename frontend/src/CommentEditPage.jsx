import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CommentEditPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    axios.get(`${BASE_URL}/api/comments/`, { withCredentials: true })
      .then(response => {
        setComments(response.data.comments);
      })
      .catch(error => {
        console.error('댓글 불러오기 실패:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2>전체 댓글 목록</h2>
      {loading ? (
        <p>불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p>등록된 댓글이 없습니다.</p>
      ) : (
        <ul>
          {comments.map(comment => (
            <li key={comment.id}>
              <strong>{comment.author || '익명'}:</strong> {comment.content}
              {comment.is_offensive && (
                <span style={{ color: 'red' }}> (악성: {comment.offensive_keyword})</span>
              )}
              <div style={{ fontSize: '0.8rem', color: '#888' }}>{comment.created_at}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentEditPage;