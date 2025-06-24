import React, { useEffect, useState } from 'react';
import axios from 'axios';

const RecentComments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/comment/api/recent-comments/', {
      withCredentials: true  // 세션 기반 인증 사용 시 필요
    })
    .then(response => {
      setComments(response.data);
    })
    .catch(error => {
      console.error('댓글 불러오기 실패:', error);
    });
  }, []);

  return (
    <div>
      <h2>최근 필터된 댓글</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>{comment.content}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecentComments;
