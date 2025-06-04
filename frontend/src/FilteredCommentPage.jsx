import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './FilteredCommentPage.css';  // ✅ CSS 파일 임포트

function FilteredCommentPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/comment/realtime-filtered-comments/', {
      withCredentials: true  // 쿠키 인증 (로그인 사용자)
    })
    .then(response => {
      setComments(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('댓글 불러오기 실패:', error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p>불러오는 중...</p>;
  }

  return (
    <div className="filtered-comment-container">
      <h2>실시간 필터링된 댓글</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            <p><strong>{comment.author || '익명'}:</strong> {comment.content}</p>
            <p><small>{comment.created_at}</small></p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FilteredCommentPage;
