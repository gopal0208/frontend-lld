import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Video } from 'lucide-react';

interface VideoPlayerProps {
  media?: {
    type: 'youtube' | 'local' | 'none';
    url: string;
    thumbnail?: string;
  };
  title: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ media, title }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showThumbnail, setShowThumbnail] = useState(true);

  useEffect(() => {
    // Reset player state when video URL changes
    setIsPlaying(false);
    setPlaybackRate(1);
    setShowThumbnail(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [media?.url]);

  if (!media || media.type === 'none') {
    return (
      <div className="video-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
        <Video size={48} style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.1)' }} />
        <p style={{ fontSize: '0.95rem' }}>No concept video available for this challenge yet.</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Videos can be added locally or embedded from YouTube!</p>
      </div>
    );
  }

  // Helper to parse YouTube URL to embed URL
  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      // Fallback if URL is already an ID
      videoId = url;
    }
    return `https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0`;
  };

  const handlePlayLocal = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      setShowThumbnail(false);
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.error("Local video failed to play", e);
      });
    }
  };

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    const speed = parseFloat(e.target.value);
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackRate(speed);
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => {
      setIsPlaying(true);
    });
  };

  if (media.type === 'youtube') {
    const embedUrl = getYouTubeEmbedUrl(media.url);
    return (
      <div className="video-container">
        <iframe
          className="video-iframe"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Local media HTML5 Custom Player
  const defaultThumbnail = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop";
  const thumbnailSrc = media.thumbnail || defaultThumbnail;

  return (
    <div className="video-container" onClick={handlePlayLocal} style={{ cursor: 'pointer' }}>
      {showThumbnail && (
        <div 
          className="custom-thumbnail-overlay" 
          style={{ backgroundImage: `url(${thumbnailSrc})` }}
        >
          <div className="play-button-large">
            <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />
          </div>
          <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem', zIndex: 4, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>LOCAL SCREEN RECORDING</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title} Concept Explanation</span>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        className="custom-video"
        src={media.url.startsWith('/') ? `.${media.url}` : media.url}
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
      />

      <div className="custom-player-controls">
        <div className="player-left">
          {isPlaying ? (
            <Pause size={18} className="play-icon" onClick={handlePlayLocal} />
          ) : (
            <Play size={18} className="play-icon" onClick={handlePlayLocal} />
          )}
          <RotateCcw size={16} className="play-icon" onClick={handleRestart} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Local Video Player</span>
        </div>

        <div className="player-right">
          <select
            className="playback-speed-select"
            value={playbackRate}
            onChange={handleSpeedChange}
          >
            <option value="0.75">0.75x</option>
            <option value="1">1.0x (Normal)</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2.0x</option>
          </select>
          {isMuted ? (
            <VolumeX size={18} className="volume-icon" onClick={handleToggleMute} />
          ) : (
            <Volume2 size={18} className="volume-icon" onClick={handleToggleMute} />
          )}
          <Maximize size={18} className="settings-icon" onClick={handleFullscreen} />
        </div>
      </div>
    </div>
  );
};
