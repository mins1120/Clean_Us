// src/pages/FilteredCommentPage.jsx
import React, { useEffect, useState } from 'react';
import api from './utils/api';       // ✅ axios 대신 api.js 사용
import './FilteredCommentPage.css';  // ✅ CSS 파일 임포트

function FilteredCommentPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportingComment, setReportingComment] = useState(null); // 신고할 댓글
  const [reason, setReason] = useState(""); // 신고 사유

  // ✅ 댓글 불러오기
  const fetchComments = () => {
    api.get('/comment/realtime-filtered-comments/')
      .then(response => {
        setComments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('댓글 불러오기 실패:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchComments();
  }, []);

  // ✅ 악성 신고 요청
  const handleReport = () => {
    if (!reason.trim()) {
      alert("신고 사유를 입력해주세요!");
      return;
    }
    api.post(`/comment/report/${reportingComment.id}/`, { reason })
      .then(res => {
        alert(res.data.detail || "신고 완료!");
        setReportingComment(null);
        setReason("");
        fetchComments(); // 목록 새로고침
      })
      .catch(err => {
        console.error("신고 실패:", err);
        alert("신고 실패: " + (err.response?.data?.error || "알 수 없는 오류"));
      });
  };

  if (loading) {
    return <p>불러오는 중...</p>;
  }

  return (
    <div className="filtered-comment-container">
      <h2>실시간 댓글 필터링</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            <p><strong>{comment.author || '익명'}:</strong> {comment.content}</p>
            <p><small>{comment.created_at}</small></p>

            {/* ✅ 정상 댓글만 신고 버튼 노출 */}
            <button onClick={() => setReportingComment(comment)}>삭제</button>
          </li>
        ))}
      </ul>

      {/* ✅ 신고 모달/박스 */}
      {reportingComment && (
        <div className="report-box">
          <h3>댓글 신고</h3>
          <p><b>대상 댓글:</b> {reportingComment.content}</p>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="이 댓글을 왜 악성으로 판단했는지 입력하세요"
          />
          <div>
            <button onClick={handleReport}>저장</button>
            <button onClick={() => { setReportingComment(null); setReason(""); }}>
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FilteredCommentPage;