// Sidebar.js
import React from 'react';
import './Sidebar.css';

function Sidebar() {
  return (
    <nav className="sidebar">
      <h2>📋 메뉴</h2>
      <ul>
        <li><a href="#">로그인 / 회원가입</a></li>
        <li><a href="#">테스트 페이지</a></li>
        <li><a href="#">원본 댓글</a></li>
        <li><a href="#">차단 대상 댓글</a></li>
        <li><a href="#">처리 완료 댓글</a></li>
        <li><a href="#">사용자 피드백</a></li>
        <li><a href="#">키워드 설정</a></li>
      </ul>
    </nav>
  );
}

export default Sidebar;
