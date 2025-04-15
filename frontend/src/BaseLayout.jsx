// BaseLayout.jsx
import React from 'react';
import Sidebar from './Sidebar';
import './BaseLayout.css';

function BaseLayout({ children }) {
  return (
    <div className="app-layout">
      <div className="main-content">
        {children}
        <footer className="footer">
          <p>© 2025 Clean Us Team | Git: https://github.com/mins1120/Clean_Us</p>
        </footer>
      </div>
      <Sidebar /> {/* 👈 사이드바를 구조적으로 오른쪽에 배치 */}
    </div>
  );
}

export default BaseLayout;
