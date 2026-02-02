import React, { useState } from 'react';
import './VideoSlider.css';

interface Video {
  id: string;
  title: string;
}

const VideoSlider: React.FC = () => {
  // Replace these with your actual YouTube video IDs
  const videos: Video[] = [
    { id: 'LjJMOF7kWsU', title: 'Retail Leaders Conference 2016' },
    { id: 'U1oatMwqyRg', title: 'Pastor Adeboye 2026 Prophecy' },
    { id: 'A28yNBOoim8', title: 'Why Christians Dont Prosper - Pastor Joseph Ebata' },
    { id: 'IEauwB_s_LA', title: 'RCCG Ambassadors Choir Ministration' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const slideLeft = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? videos.length - 1 : prevIndex - 1
    );
  };

  const slideRight = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === videos.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="video-slider-container">
      <h2 className="slider-title">Our Videos</h2>
      
      <div className="slider-wrapper">
        {/* Left Arrow */}
        <button className="slider-btn left" onClick={slideLeft}>
          ←
        </button>

        {/* Video Display Area */}
        <div className="video-display">
          {videos.slice(currentIndex, currentIndex + 3).map((video, index) => (
            <div key={index} className="video-item">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button className="slider-btn right" onClick={slideRight}>
          →
        </button>
      </div>

      {/* Dots indicator */}
      <div className="dots-container">
        {videos.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}; 
export default VideoSlider;
