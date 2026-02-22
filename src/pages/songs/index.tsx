import { useState, useRef, useEffect } from "react";
import { Music, Play, Pause, Volume2, VolumeX, X } from "lucide-react";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import "./songs.css";
import audio from "/assets/audio/Lagu_Mars_WR_Supratman_Medan.mp3";

interface Song {
  id: number;
  title: string;
  subtitle: string;
  composer: string;
  year: string;
  audioUrl: string;
  lyrics: string[];
}

const Songs = () => {
  const [currentSong, setCurrentSong] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showLyricsId, setShowLyricsId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const songs: Song[] = [
    {
      id: 1,
      title: "Mars WR Supratman Medan",
      subtitle: "Lagu Kebanggaan Sekolah",
      composer: "Ciptaan: T Sihombing",
      year: "2020",
      audioUrl: `${audio}`,
      lyrics: [
        "1, 2, 3, 4",
        "Pribukit, Pribukit",
        "Itu nama suatu perguruan",
        "Pribukit, Pribukit, Pribukit",
        "Sekarang bernama W. R. Supratman",

        "Perguruan yang menjadi sanjungan",
        "Berkat didikan dan disiplinnya",
        "W. R. Supratman menjadi pujaan",
        "Setiap pelajar yang ditamatkan",

        "Perguruan yang selalu mendidiknya",
        "Hormat setia pada Nusa Bangsanya",
        "Dan cahaya selamanya",
      ],
    },
  ];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const playSong = (songId: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (currentSong === songId) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      const song = songs.find((s) => s.id === songId);
      if (song) {
        audio.src = song.audioUrl;
        audio.play();
        setCurrentSong(songId);
        setIsPlaying(true);
      }
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const closePlayer = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setCurrentSong(null);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const time = parseFloat(e.target.value);
    audio.currentTime = time;
    setCurrentTime(time);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const vol = parseFloat(e.target.value);
    audio.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <>
      <Navbar />
      <div className="songs-container">
        <div className="songs-hero">
          <div className="hero-icon">
            <Music size={48} />
          </div>
          <h1 className="songs-title">Lagus Mars WR Supratman Medan</h1>
          <p className="songs-subtitle">
            Dengarkan dan resapi makna dalam setiap lirik lagu sekolah kami
          </p>
        </div>

        <div className="songs-grid">
          {songs.map((song) => (
            <div
              key={song.id}
              className={`song-card-modern ${
                currentSong === song.id ? "playing" : ""
              }`}
            >
              <div className="equalizer-container">
                {currentSong === song.id && isPlaying && (
                  <div className="equalizer">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                  </div>
                )}
              </div>

              <div className="card-main-content">
                <div className="song-info">
                  <div className="song-number">#{song.id}</div>
                  <h2 className="modern-song-title">{song.title}</h2>
                  <p className="modern-song-subtitle">{song.subtitle}</p>
                  <div className="song-details">
                    <span className="composer">
                      <Volume2 size={16} />
                      {song.composer}
                    </span>
                    <span className="year-badge">{song.year}</span>
                  </div>
                </div>

                <button
                  className="modern-play-btn"
                  onClick={() => playSong(song.id)}
                >
                  {currentSong === song.id && isPlaying ? (
                    <Pause size={32} />
                  ) : (
                    <Play size={32} />
                  )}
                </button>
              </div>

              <div className="direct-lyrics-container">
                <div className="lyrics-header">
                  <Music size={18} />
                  <span>Lirik Lagu</span>
                </div>
                <div className="direct-lyrics-content">
                  {song.lyrics.map((line, index) => {
                    if (line === "")
                      return (
                        <p key={index} className="empty-line">
                          {"\u00A0"}
                        </p>
                      );

                    const hasTime = line.trim().startsWith("(");
                    let timeTag = "";
                    let text = line;

                    if (hasTime) {
                      const match = line.match(/^\((.*?)\)\s*/);
                      if (match) {
                        timeTag = match[0];
                        text = line.replace(match[0], "").trim();
                      }
                    }

                    return (
                      <p key={index} className="lyrics-line-direct">
                        {hasTime && <span className="time-tag">{timeTag}</span>}
                        {text}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {currentSong !== null && (
          <div className="audio-player-bar">
            <div className="player-content">
              <div className="now-playing-info">
                <Music size={20} />
                <span className="now-playing-text">
                  {songs.find((s) => s.id === currentSong)?.title}
                </span>
              </div>

              <div className="player-controls">
                <button
                  className="player-play-pause-btn"
                  onClick={togglePlayPause}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <span className="time-display">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="seek-bar"
                />
                <span className="time-display">{formatTime(duration)}</span>
              </div>

              <div className="player-right-controls">
                <div className="volume-control">
                  <button onClick={toggleMute} className="volume-btn">
                    {isMuted || volume === 0 ? (
                      <VolumeX size={20} />
                    ) : (
                      <Volume2 size={20} />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-bar"
                  />
                </div>

                <button
                  className="close-player-btn"
                  onClick={closePlayer}
                  title="Tutup Player"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showLyricsId !== null && (
        <div className="lyrics-overlay" onClick={() => setShowLyricsId(null)}>
          <div
            className="lyrics-modal-modern"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <Music size={24} />
              <h3 className="modal-lyrics-title">
                {songs.find((s) => s.id === showLyricsId)?.title}
              </h3>
            </div>

            <div className="modal-lyrics-content">
              {songs
                .find((s) => s.id === showLyricsId)
                ?.lyrics.map((line, index) => {
                  if (line === "")
                    return (
                      <p key={index} className="empty-line">
                        {"\u00A0"}
                      </p>
                    );

                  const hasTime = line.trim().startsWith("(");
                  let timeTag = "";
                  let text = line;

                  if (hasTime) {
                    const match = line.match(/^\((.*?)\)\s*/);
                    if (match) {
                      timeTag = match[0];
                      text = line.replace(match[0], "").trim();
                    }
                  }

                  return (
                    <p key={index} className="lyrics-line-modern">
                      {hasTime && <span className="time-tag">{timeTag}</span>}
                      {text}
                    </p>
                  );
                })}
            </div>

            <button
              className="close-modal-btn"
              onClick={() => setShowLyricsId(null)}
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <audio ref={audioRef} />

      <Footer />
    </>
  );
};

export default Songs;
