import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CommentOffensivePage.css';

function CommentOffensivePage() {
  const [offensiveComments, setOffensiveComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    axios
      .get(`${BASE_URL}/api/comments/offensive/`, { withCredentials: true })
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
              <span className="comment-offensive"> (악성: {comment.offensive_keyword})</span>
              <div className="comment-date">{comment.created_at}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentOffensivePage;
