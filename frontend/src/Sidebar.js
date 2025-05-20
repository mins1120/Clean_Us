// src/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

function Sidebar() {
  // 로그아웃 처리 함수
  const handleLogout = async () => {
    const confirmed = window.confirm('정말 로그아웃하시겠습니까?');
    if (confirmed) {
      try {
        await axios.post('http://127.0.0.1:8000/user/api/logout/', {}, {
          withCredentials: true
        });
        window.location.href = '/'; // 로그아웃 후 메인 페이지로 이동
      } catch (error) {
        console.error('로그아웃 실패:', error);
      }
    }
  };

  return (
    <nav className="sidebar">
      <h2>📋 메뉴</h2>
      <ul>
        <li><Link to="/login">로그인</Link></li>
        <li><Link to="/signup">회원가입</Link></li>
        <li><a href="#">테스트 페이지</a></li>
        <li><a href="#">원본 댓글</a></li>
        <li><a href="#">차단 대상 댓글</a></li>
        <li><a href="#">처리 완료 댓글</a></li>
        <li><a href="#">사용자 피드백</a></li>
        <li><a href="#">키워드 설정</a></li>

        {/* 로그아웃 버튼 */}
        <li>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              color: '#000',
              padding: 0,
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: 'inherit'
            }}
          >
            로그아웃
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Sidebar;


