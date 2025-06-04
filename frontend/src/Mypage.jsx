// src/pages/Mypage.jsx

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChangePassword from './ChangePassword';
import { getCookie } from './utils/csrf';
import './Mypage.css';

const Mypage = () => {
  const didFetch = useRef(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [newName, setNewName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;

    axios.get('http://localhost:8000/user/api/mypage/detail/', { withCredentials: true })
      .then(res => {
        setEmail(res.data.email);
        setName(res.data.name);
        setNewName(res.data.name);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('유저 정보 불러오기 실패:', err);
        alert('로그인이 필요합니다.');
        window.location.href = 'http://localhost:3000/login';
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const csrfToken = getCookie('csrftoken');

    axios.put(
      'http://localhost:8000/user/api/mypage/update/',
      { name: newName },
      {
        withCredentials: true,
        headers: { 'X-CSRFToken': csrfToken }
      }
    )
      .then(res => {
        setMessage(res.data.message);
        setName(newName);
      })
      .catch(err => {
        console.error('정보 수정 실패:', err);
        setMessage('정보 수정에 실패했습니다.');
      });
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말 회원 탈퇴를 진행하시겠습니까?\n(삭제된 데이터는 복구할 수 없습니다.)')) {
      return;
    }
    try {
      const csrfToken = getCookie('csrftoken');
      await axios.post(
        'http://localhost:8000/user/delete/',
        {},
        {
          headers: { 'X-CSRFToken': csrfToken },
          withCredentials: true,
        }
      );
      alert('회원 탈퇴가 완료되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('[회원 탈퇴 오류]', error);
      alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  if (isLoading) return null;

  return (
    <div className="mypage-wrapper">
      <h2 className="mypage-title">마이페이지</h2>

      <form onSubmit={handleSubmit} className="mypage-form">
        <div className="mypage-group">
          <label className="mypage-label">이메일</label>
          <input type="email" value={email} disabled className="mypage-input" />
        </div>

        <div className="mypage-group">
          <label className="mypage-label">이름</label>
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="mypage-input"
          />
        </div>

        <button type="submit" className="mypage-btn submit">수정하기</button>
      </form>

      <div className="mypage-password-section">
        <ChangePassword onSuccess={() => {}} />
      </div>

      {/* 수정된 회원 탈퇴 버튼 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          className="mypage-btn delete"
          onClick={handleDeleteAccount}
        >
          회원 탈퇴
        </button>
      </div>

      {message && <p className="mypage-message">{message}</p>}
    </div>
  );
};

export default Mypage;
