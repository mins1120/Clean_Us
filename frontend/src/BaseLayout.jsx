import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Sidebar from './Sidebar';
import './BaseLayout.css';

function BaseLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="app-layout">
      <header className="header">
        <div className="logo">
          <Link to="/" className="logo-link">Clean Us</Link>
        </div>

        <div className="header-right">
          <div className="auth-buttons">
            <a href="/login">로그인</a>
            <a href="/signup">회원가입</a>
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
