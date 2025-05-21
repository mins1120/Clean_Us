import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './HeroSection.css';

const HeroSection = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: false,       // ✅ 스크롤 시 반복 애니메이션
      mirror: true       // ✅ 위로 스크롤할 때도 재실행
    });
    AOS.refresh();       // ✅ 컴포넌트 로딩 후 갱신
  }, []);

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
        paddingLeft: '15%',
      }}
    >
      <div className="overlay" />
      <div className="hero-content" data-aos="fade-up">
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
