import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Sidebar.css';

function Sidebar({ onClose }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:8000/user/api/mypage/detail/', {
      withCredentials: true
    })
    .then((res) => {
      setIsLoggedIn(true);
    })
    .catch((err) => {
      setIsLoggedIn(false);
    });
  }, []);

  const handleLogout = async () => {
    const confirmed = window.confirm('정말 로그아웃하시겠습니까?');
    if (confirmed) {
      try {
        await axios.post('http://localhost:8000/user/api/logout/', {}, {
          withCredentials: true
        });

        // 쿠키 삭제 (추가적으로 안전하게)
        document.cookie = "sessionid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = "csrftoken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        window.location.href = '/';
      } catch (error) {
        console.error('로그아웃 실패:', error);
      }
    }
  };

  return (
    <nav className="sidebar-content">
      <button className="close-btn" onClick={onClose}>×</button>

      <div className="sidebar-section">
        <h3 className="section-title with-border">홈페이지</h3>
        <ul className="sidebar-list">
          {isLoggedIn ? (
            <>
              <li><Link to="/mypage">마이페이지</Link></li>
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
            </>
          ) : (
            <>
              <li><Link to="/login">로그인</Link></li>
              <li><Link to="/signup">회원가입</Link></li>
            </>
          )}
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">실시간 댓글 분석</h3>
        <ul className="sidebar-list">
          <li><Link to="/filtered-comments">필터링 댓글</Link></li>
          <li><Link to="/comments/edit">댓글 조회/수정</Link></li>
          <li><Link to="/comments/offensive">악성 댓글 목록</Link></li>
        </ul>
      </div>

      <div className="sidebar-section">
        <h3 className="section-title">관리 페이지</h3>
        <ul className="sidebar-list">
          <li><Link to="/feedbacks">사용자 피드백</Link></li>
          <li><Link to="/keywords">키워드 설정</Link></li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
