// Sidebar.jsx
import React from 'react';
import './Sidebar.css';

function Sidebar({ onClose }) {
  return (
    <nav className="sidebar-content">
      <button className="close-btn" onClick={onClose}>×</button>

      <div className="sidebar-section">
        <h3 className="section-title with-border">홈페이지</h3>
        <ul className="sidebar-list">
          <li><a href="#">로그인</a></li>
          <li><a href="#">회원가입</a></li>
          <li><a href="#">마이페이지</a></li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">실시간 댓글 분석</h3>
        <ul className="sidebar-list">
          <li><a href="#">필터링 댓글</a></li>
          <li><a href="#">댓글 조회/수정</a></li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">관리 페이지</h3>
        <ul className="sidebar-list">
          <li><a href="/feedbacks">사용자 피드백</a></li>
          <li><a href="/keywords">키워드 설정</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
