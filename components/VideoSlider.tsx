import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const YouTubeSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const scrollContainerRef = useRef(null);

  // Example YouTube videos - replace with your actual video IDs and data
  const videos = [
    {
      id: 'VTN2VKQTo2Q',
      title: 'Conversation With Pastor Ibukun Efuntayo - Chairman WEMABOD NIGERIA',
      views: '223',
      duration: '28.02'
    },
    {
      id: 'YhAWD6-qNkk',
      title: 'Every Tongue and Tribe 2025 YORUBA DAY',
      views: '23',
      duration: '3:22:56'
    },
    {
      id: 'l3_SrHBJ6vA',
      title: 'I CAN NOT BE BARREN',
      views: '30',
      duration: '1:04:19'
    },
    {
      id: 'Fg9m-VIGifc',
      title: 'President of Bervidson Retail Group/ Founder of Retail Academy',
      views: '15',
      duration: '8:47'
    },
    {
      id: 'xN6TADxLuQc',
      title: 'Rest in the family through Praise',
      views: '31',
      duration: '31:33'   
    },
    {
      id: 'Cz81v3OjOHo',
      title: 'VIDORA FEEL THE SEASON',
      views: '21k',
      duration: '1.00'
    }
  ];

  const slideLeft = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const slideRight = () => {
    if (currentIndex < videos.length - 3) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleVideoClick = (videoId) => {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
  };

  return (
    <div className="youtube-slider-container">
      <div className="slider-wrapper">
        <button
          onClick={slideLeft}
          disabled={currentIndex === 0}
          className="nav-button nav-button-left"
          aria-label="Previous videos"
        >
          <ChevronLeft size={24} />
        </button>

        <div className="videos-container" ref={scrollContainerRef}>
          <div
            className="videos-track"
            style={{
              transform: `translateX(-${currentIndex * 33.333}%)`
            }}
          >
            {videos.map((video, index) => (
              <div
                key={video.id}
                className={`video-card ${hoveredIndex === index ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => handleVideoClick(video.id)}
              >
                <div className="thumbnail-wrapper">
                  <img
                    src={`https://img.youtube.com/vi/${video.id}/maxresdefault.jpg`}
                    alt={video.title}
                    className="thumbnail"
                  />
                  <div className="duration-badge">{video.duration}</div>
                  <div className="play-overlay">
                    <div className="play-button">
                      <Play size={32} fill="white" />
                    </div>
                  </div>
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-views">{video.views} views</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={slideRight}
          disabled={currentIndex >= videos.length - 3}
          className="nav-button nav-button-right"
          aria-label="Next videos"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div className="dots-container">
        {Array.from({ length: videos.length - 2 }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`dot ${currentIndex === index ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style>{`
        .youtube-slider-container {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .slider-wrapper {
          position: relative;
          padding: 0 60px;
        }

        .videos-container {
          overflow: hidden;
          border-radius: 12px;
        }

        .videos-track {
          display: flex;
          gap: 24px;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .video-card {
          flex: 0 0 calc(33.333% - 16px);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 12px;
          overflow: hidden;
          background: #f8f9fa;
        }

        .video-card.hovered {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        .thumbnail-wrapper {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 aspect ratio */
          overflow: hidden;
          background: #000;
        }

        .thumbnail {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .video-card.hovered .thumbnail {
          transform: scale(1.05);
        }

        .duration-badge {
          position: absolute;
          bottom: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.85);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 600;
          z-index: 2;
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0);
          transition: background 0.3s ease;
          opacity: 0;
        }

        .video-card.hovered .play-overlay {
          background: rgba(0, 0, 0, 0.4);
          opacity: 1;
        }

        .play-button {
          width: 64px;
          height: 64px;
          background: rgba(255, 0, 0, 0.9);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(0.8);
          transition: all 0.3s ease;
        }

        .video-card.hovered .play-button {
          transform: scale(1);
          background: rgba(255, 0, 0, 1);
        }

        .video-info {
          padding: 16px;
        }

        .video-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 8px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .video-views {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .nav-button {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          border: none;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          z-index: 10;
        }

        .nav-button:hover:not(:disabled) {
          background: #f5f5f5;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          transform: translateY(-50%) scale(1.05);
        }

        .nav-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .nav-button-left {
          left: 0;
        }

        .nav-button-right {
          right: 0;
        }

        .dots-container {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-top: 32px;
        }

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: #d1d5db;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 0;
        }

        .dot:hover {
          background: #9ca3af;
          transform: scale(1.2);
        }

        .dot.active {
          background: #ff0000;
          width: 24px;
          border-radius: 4px;
        }

        @media (max-width: 1024px) {
          .video-card {
            flex: 0 0 calc(50% - 12px);
          }
        }

        @media (max-width: 640px) {
          .slider-wrapper {
            padding: 0 40px;
          }

          .video-card {
            flex: 0 0 100%;
          }

          .nav-button {
            width: 36px;
            height: 36px;
          }

          .video-title {
            font-size: 14px;
          }
        }
      `}</style>
    </div>
  );
};

export default YouTubeSlider;