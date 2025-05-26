import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './MainFunctionSection.css';

function MainFunctionSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true
    });
    AOS.refresh();
  }, []);

  return (
    <section className="main-function-section" data-aos="fade-up">
      <p className="sub-title">Clean Us</p>
      <h2 className="main-title">MAIN FUNCTION</h2>

      <div className="function-grid">
        <div className="function-item" data-aos="fade-up" data-aos-delay="0">
          <img src={`${process.env.PUBLIC_URL}/img/section3_1.jpeg`} alt="실시간 댓글 분석" />
          <p>실시간 댓글 분석</p>
        </div>
        <div className="function-item" data-aos="fade-up" data-aos-delay="200">
          <img src={`${process.env.PUBLIC_URL}/img/section3_2.jpeg`} alt="관리 페이지" />
          <p>관리 페이지</p>
        </div>
        <div className="function-item" data-aos="fade-up" data-aos-delay="400">
          <img src={`${process.env.PUBLIC_URL}/img/section3_3.jpeg`} alt="사용자 피드백" />
          <p>사용자 피드백</p>
        </div>
      </div>
    </section>
  );
}

export default MainFunctionSection;
