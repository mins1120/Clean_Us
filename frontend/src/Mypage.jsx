// 🔹 마이페이지 컴포넌트: 사용자 정보 조회 및 이름 수정 기능 포함
//import { getCookie } from './utils/csrf'; // 경로는 실제 구조에 맞게 조정
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ChangePassword from './ChangePassword';
import { getCookie } from './utils/csrf';

// function getCookie(name) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop().split(';').shift();
// }


const Mypage = () => {
  // 🔸 사용자 정보와 메시지 상태값 정의
  const didFetch = useRef(false);
  const [email, setEmail] = useState('');        // 이메일 정보
  const [name, setName] = useState('');          // 기존 이름
  const [newName, setNewName] = useState('');    // 수정할 이름
  const [message, setMessage] = useState('');    // 알림 메시지
  const [isLoading, setIsLoading] = useState(true);
  const [showChangePw, setShowChangePw] = useState(false);
  const navigate = useNavigate();

  // 🔹 컴포넌트 처음 마운트 시 유저 정보 불러오기
  useEffect(() => {
    if (didFetch.current) return;    // 두 번째 호출이면 무시
    didFetch.current = true;
   // 🔹 2. 사용자 정보 받아오기
    axios.get('http://localhost:8000/user/api/mypage/detail/', { withCredentials: true })  // 쿠키 포함 요청
      .then(res => {
        console.log('email : ', res.data.email)
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

  // 🔹 이름 수정 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    //const csrfToken = sessionStorage.getItem('csrfToken');  // ✅ 세션스토리지에서 꺼냄
    const csrfToken = getCookie('csrftoken');  // ✅ 이거 사용!
    console.log('사용할 CSRF 토큰:', csrfToken);

    axios.put('http://localhost:8000/user/api/mypage/update/',
      { name: newName },
      {
        withCredentials: true,                 // ✅ 세션 쿠키 포함
        headers: { 'X-CSRFToken': csrfToken }  // ✅ 토큰 헤더에 직접 삽입
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
  
  // ① 탈퇴 처리 함수
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
      // 필요에 따라 리디렉션 경로 조정
      navigate('/');
    } catch (error) {
      console.error('[회원 탈퇴 오류]', error);
      alert('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };
    // 🔹 로딩 중일 때는 아무것도 렌더링하지 않음
  if (isLoading) return null;
  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">마이페이지</h2>

      <div className="mb-4">
        <label className="block mb-1">이메일</label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full border px-3 py-2 bg-gray-100"
        />
      </div>

      <form onSubmit={handleSubmit}>
        <label className="block mb-1">이름</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full border px-3 py-2"
        />
        <button
          type="submit"
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          수정하기
        </button>
      </form>
      {/* 비밀번호 변경 버튼 */}
<button
  onClick={() => setShowChangePw(true)}
  className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
>
  비밀번호 변경
</button>

{/* ChangePassword 컴포넌트 */}
{showChangePw && (
  <ChangePassword onSuccess={() => setShowChangePw(false)} />
)}


      
      
      
      <button
        onClick={handleDeleteAccount}
        style={{
          marginTop: '2rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#e74c3c',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        회원 탈퇴
      </button>

      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
};

export default Mypage;
 