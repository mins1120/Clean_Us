import React, { useEffect, useState } from 'react';
import api from './utils/api';   // ✅ axios → api 교체
import './CommentOffensivePage.css';

function CommentOffensivePage() {
  const [offensiveComments, setOffensiveComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/comment/offensive-page/')
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
    <div className="comment-container">
      <h2>악성 댓글 목록</h2>
      {loading ? (
        <p className="comment-loading">불러오는 중...</p>
      ) : offensiveComments.length === 0 ? (
        <p className="comment-empty">⚠️ 악성 댓글이 없습니다.</p>
      ) : (
        <ul className="comment-list">
          {offensiveComments.map(comment => (
            <li key={comment.id} className="comment-item">
              <strong className="comment-author">{comment.author || '익명'}:</strong>
              <span className="comment-content">{comment.content}</span>
              <span className="comment-offensive"> (악성: {comment.offensive_reason})</span>
              <div className="comment-date">{comment.created_at}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentOffensivePage;
