import React, { useEffect, useState } from 'react';
import api from './utils/api';   // ✅ axios → api 교체
import './CommentOffensivePage.css';

function CommentOffensivePage() {
  const [offensiveComments, setOffensiveComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingComment, setEditingComment] = useState(null); // 현재 복원 중인 댓글
  const [reason, setReason] = useState(""); // 사유 입력

  // ✅ 댓글 목록 불러오기
  const fetchComments = () => {
    setLoading(true);
    api.get('/comment/offensive-page/')
      .then(response => {
        setOffensiveComments(response.data.offensive_comments);
      })
      .catch(error => {
        console.error('댓글 불러오기 실패:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchComments();
  }, []);

    // ✅ 복원 저장 요청
  const handleRestore = () => {
    if (!reason.trim()) {
      alert("사유를 입력해주세요!");
      return;
    }
    api.post(`/comment/restore/${editingComment.id}/`, { reason })
      .then(res => {
        alert(res.data.detail || "복원 완료!");
        setEditingComment(null);
        setReason("");
        fetchComments(); // 목록 갱신
      })
      .catch(err => {
        console.error("복원 실패:", err);
        alert("복원 실패: " + (err.response?.data?.error || "알 수 없는 오류"));
      });
  };

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
              {/* ✅ 악성 댓글만 "복원하기" 버튼 표시 */}
              <button 
                className="restore-btn"
                onClick={() => setEditingComment(comment)}
              >
              삭제
              </button>
              {/* ✅ 복원 모드 */}
              {editingComment?.id === comment.id && (
                <div className="restore-box">
                  <h3>댓글 복원</h3>
                  <p><b>원본:</b> {editingComment.content}</p>
                  <textarea
                    className="restore-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="왜 이 댓글이 악성이 아니라고 판단했는지 입력하세요"
                  />
                  <div>
                    <button onClick={handleRestore}>저장</button>
                    <button onClick={() => { setEditingComment(null); setReason(""); }}>
                      취소
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      
    </div>
  );
}

export default CommentOffensivePage;
