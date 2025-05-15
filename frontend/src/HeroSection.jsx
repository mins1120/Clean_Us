import React from 'react';
import './HeroSection.css'; // 나머지 스타일만 이 파일에서 관리

const HeroSection = () => {
  return (
   <section
  className="hero-section"
  style={{
    backgroundImage: `url('/img/mainimg.jpg')`,
    height: '70vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    color: 'white',
    paddingLeft: '15%', // 💡 기존 60px → 15% 로 수정
  }}
>

      <div className="overlay" />
      <div className="hero-content">
        <p className="tagline">Clean Up Your Comments</p>
        <h1>
          악성 댓글을 걸러내다
          <br />
          서비스로 깨끗한 환경
        </h1>
        <button className="start-button">시작하기</button>
      </div>
    </section>
  );
};

export default HeroSection;
