import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './Sidebar';
import './BaseLayout.css';

function BaseLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    axios.get('http://localhost:8000/user/api/mypage/detail/', {
      withCredentials: true,
    })
    .then(() => setIsLoggedIn(true))
    .catch(() => setIsLoggedIn(false));
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = async () => {
    const confirmed = window.confirm('정말 로그아웃하시겠습니까?');
    if (confirmed) {
      try {
        await axios.post('http://localhost:8000/user/api/logout/', {}, {
          withCredentials: true,
        });
        window.location.href = '/'; // 로그아웃 후 리로드
      } catch (err) {
        console.error('로그아웃 실패:', err);
      }
    }
  };

  return (
    <div className="app-layout">
      <header className="header">
        <div className="logo">
          <Link to="/" className="logo-link">Clean Us</Link>
        </div>

        <div className="header-right">
          <div className="auth-buttons">
            {isLoggedIn ? (
              <>
                <Link to="/mypage">마이페이지</Link>
                <button
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#000',
                    padding: 0,
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login">로그인</Link>
                <Link to="/signup">회원가입</Link>
              </>
            )}
          </div>

          {!sidebarOpen && (
            <div className="hamburger" onClick={toggleSidebar}>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>
      </header>

      <div className={`main-content ${isHome ? 'no-padding' : ''}`}>
        <Outlet />
      </div>

      <footer className="footer">
        <div className="footer-content">
          <h2>Clean Us</h2>
          <p>
            상호: Clean Us &nbsp;&nbsp;&nbsp;
            대표: 대표자 &nbsp;&nbsp;&nbsp;
            개인정보책임자: 책임자
            <br />
            소재지: 한신대학교 Clean Us 사업단 &nbsp;&nbsp;&nbsp;
            사업자 등록번호: 000-00-00000 &nbsp;&nbsp;&nbsp;
            통신번호: 0000-서울중구-0000호
          </p>
          <p>
            COPYRIGHT (C) Clean Us. All Rights reserved
            <br />
            Powered by QSHOP
          </p>
        </div>
      </footer>

      <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Sidebar onClose={toggleSidebar} />
      </div>
    </div>
  );
}

export default BaseLayout;
