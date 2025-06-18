// src/CommentEditPage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CommentEditPage.css';

function CommentEditPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = 'http://localhost:8000';

  useEffect(() => {
    axios
      .get(`${BASE_URL}/comment/list/`, { withCredentials: true })
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
    <div className="edit-comment-container">
      <h2>전체 댓글 목록</h2>
      {loading ? (
        <p className="edit-comment-loading">불러오는 중...</p>
      ) : comments.length === 0 ? (
        <p className="edit-comment-empty">등록된 댓글이 없습니다.</p>
      ) : (
        <ul className="edit-comment-list">
          {comments.map(comment => (
            <li key={comment.id} className="edit-comment-item">
              <strong className="edit-comment-author">{comment.author || '익명'}:</strong>
              <span className="edit-comment-content"> {comment.content}</span>
              {comment.is_offensive && (
                <span className="edit-comment-offensive">
                  {' '}(악성: {comment.offensive_reason})
                </span>
              )}
              <div className="edit-comment-date">{comment.created_at}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentEditPage;
