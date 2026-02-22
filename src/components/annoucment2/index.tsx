import { Bell, X, Calendar, ArrowRight, Megaphone } from "lucide-react";
import { useState, useEffect } from "react";
import "./annoucment2.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { getRequest } from "../../utils/api-call";
import { formatTime } from "../../utils/time-format";

export interface Metadata {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface Data {
  pengumuman_id: string;
  judul: string;
  deskripsi: string;
  konten: string;
  tanggal_publikasi: string;
  is_published: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  jenjang_id?: string;
  penulis_user_id: string;
  editor_user_id?: string;
  jenjangJenjang_id?: string;
}

export interface ActivityResponse {
  message: string;
  metadata: Metadata;
  data: Data[];
}

const Announcement2 = () => {
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Data | null>(
    null,
  );
  const [data, setData] = useState<ActivityResponse["data"] | null>(null);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getRequest(`pengumuman?page=1&limit=3`);
        setData(response.data);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  return (
    <>
      <div className="ann-wrapper">
        {/* Hero Header */}
        <div className="ann-hero" data-aos="fade-down">
          <div className="ann-hero-icon">
            <Megaphone size={48} strokeWidth={2.5} />
          </div>
          <h1 className="ann-hero-title">Pusat Pengumuman</h1>
          <p className="ann-hero-desc">
            Informasi penting dan update terkini untuk seluruh siswa dan guru
          </p>
          <div className="ann-hero-badge">
            <Bell size={16} />
            <span>{data?.length} Pengumuman Aktif</span>
          </div>
        </div>

        {/* Content Grid */}
        <div className="ann-container">
          <div className="ann-grid">
            {data &&
              data.map((announcement, index) => (
                <div
                  key={announcement.pengumuman_id}
                  className="ann-card"
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                  onClick={() => setSelectedAnnouncement(announcement)}
                >
                  {/* Card Badge */}
                  <div className="ann-card-badge">
                    <Bell size={14} />
                    <span>Pengumuman</span>
                  </div>

                  {/* Card Content */}
                  <div className="ann-card-content">
                    <h3 className="ann-card-title">{announcement.judul}</h3>

                    <div className="ann-card-meta">
                      <Calendar size={16} />
                      <span>
                        {formatTime(
                          announcement.tanggal_publikasi,
                          "DD MMMM yyyy",
                        )}
                      </span>
                    </div>

                    <p className="ann-card-desc">{announcement.konten}</p>
                  </div>

                  {/* Card Footer */}
                  <div className="ann-card-footer">
                    <button className="ann-card-btn">
                      <span>Baca Selengkapnya</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>

                  {/* Decorative Corner */}
                  <div className="ann-card-corner"></div>
                </div>
              ))}
          </div>
        </div>

        {/* MODAL */}
        {selectedAnnouncement && (
          <div
            className="ann-modal-overlay"
            onClick={() => setSelectedAnnouncement(null)}
          >
            <div className="ann-modal" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="ann-modal-header">
                <div className="ann-modal-icon">
                  <Bell size={24} />
                </div>
                <button
                  className="ann-modal-close"
                  onClick={() => setSelectedAnnouncement(null)}
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Title */}
              <h2 className="ann-modal-title">{selectedAnnouncement.judul}</h2>

              {/* Modal Meta */}
              <div className="ann-modal-meta">
                <div className="ann-modal-meta-item">
                  <Calendar size={18} />
                  <div>
                    <span className="ann-modal-meta-label">Tanggal</span>
                    <span className="ann-modal-meta-value">
                      {formatTime(
                        selectedAnnouncement.tanggal_publikasi,
                        "DD MMMM yyyy",
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Description */}
              <div className="ann-modal-body">
                <p className="ann-modal-desc">{selectedAnnouncement.konten}</p>
              </div>

              {/* Modal Footer */}
              <div className="ann-modal-footer">
                <button
                  className="ann-modal-btn"
                  onClick={() => setSelectedAnnouncement(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Announcement2;
