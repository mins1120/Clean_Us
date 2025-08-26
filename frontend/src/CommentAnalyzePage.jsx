import React, { useEffect, useState } from 'react';
import api from './utils/api';
import './CommentAnalyzePage.css';   // ✅ 새 CSS 파일 임포트

function CommentAnalyzePage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    api.get('/comment/realtime-filtered-comments/')
      .then(response => {
        setComments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('댓글 불러오기 실패:', error);
        setLoading(false);
      });
  }, []);

  const handleAnalyze = () => {
    if (!newComment.trim()) return;

    setAnalyzing(true);
    api.post('/comment/analyze/', { text: newComment })
      .then(response => {
        setAnalysisResult(response.data);
      })
      .catch(error => {
        console.error('AI 분석 실패:', error);
        setAnalysisResult({ error: '분석에 실패했습니다.' });
      })
      .finally(() => {
        setAnalyzing(false);
      });
  };

  if (loading) {
    return <p>불러오는 중...</p>;
  }

  return (
    <div className="filtered-comment-container">
      <h2>AI 분석</h2>
     

      <div className="comment-analyze-box">
        <textarea
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="댓글을 입력하세요..."
        />
        <button 
          className="analyze-btn"
          onClick={handleAnalyze}
          disabled={analyzing}
        >
          {analyzing ? '분석 중...' : 'AI 분석하기'}
        </button>
      </div>

      {analysisResult && (
        <div className="analysis-result">
          {analysisResult.error ? (
            <p className="error">{analysisResult.error}</p>
          ) : (
            <>
              <p><strong>AI 분석 결과:</strong></p>
              <p>악성 여부: {analysisResult.is_offensive ? '🚨 악성' : '✅ 정상'}</p>
              {analysisResult.reason && (
                <p>사유: {analysisResult.reason}</p>
              )}
              {analysisResult.confidence && (
                <p>신뢰도: {analysisResult.confidence}</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CommentAnalyzePage;
