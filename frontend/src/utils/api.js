// src/utils/api.js
import axios from 'axios';
import { getCookie } from './csrf';  // ✅ 이미 있는 csrf.js 활용

// Django 백엔드 기본 주소
const BASE_URL = 'http://localhost:8000';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // ✅ 로그인 세션/쿠키 자동 포함
});

// 요청 인터셉터 → CSRF 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    // POST, PUT, PATCH, DELETE 요청일 때만 CSRF 토큰 추가
    if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
      const csrfToken = getCookie('csrftoken');
      if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 → 에러 로깅 (선택)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API 요청 실패:', error);
    return Promise.reject(error);
  }
);

export default api;
