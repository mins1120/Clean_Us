import React from 'react';
import './MissionSection.css';

const MissionSection = () => {
  return (
    <section className="mission-section">
      <div className="mission-content">
        <div className="mission-item">
          <h3>01 <span>Mission</span></h3>
          <p>
            우리는 온라인 커뮤니티의 긍정적이고 안전한 환경을 조성하는 데 중점을 둡니다.
            악성 댓글을 효과적으로 걸러내어 사용자 경험을 항상 향상시키고자 합니다.
          </p>
        </div>
        <div className="mission-item">
          <h3>02 <span>Vision</span></h3>
          <p>
            모든 온라인 플랫폼에서 악성 댓글이 없는 환경을 만드는 것이 우리의 목표입니다.
            사용자들이 자유롭게 소통할 수 있는 공간을 제공합니다.
          </p>
        </div>
        <div className="mission-item">
          <h3>03 <span>Values</span></h3>
          <p>
            신뢰, 혁신, 그리고 사용자 중심의 접근 방식을 통해 커뮤니티를 보호하고,
            지속 가능한 온라인 환경을 구축합니다.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
