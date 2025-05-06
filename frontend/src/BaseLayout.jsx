//BaseLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import './BaseLayout.css';

function BaseLayout() {
  return (
    <div className="app-layout">
      <div className="main-content">
        <Outlet /> {/* 현재 라우트에 해당하는 컴포넌트 렌더링 */}
        <footer className="footer">
          <p>© 2025 Clean Us Team | Git: https://github.com/mins1120/Clean_Us</p>
        </footer>
      </div>
      <Sidebar />
    </div>
  );
}

export default BaseLayout;