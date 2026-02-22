import { useState } from "react";
import "./facility.css";
import Footer from "../../components/footer";
import Navbar from "../../components/navbar";
import { facilities, type Facility } from "../../data";

export default function Fasilitas() {
  const [selectedFacility, setSelectedFacility] = useState<Facility>(
    facilities[0]
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const handleFacilityClick = (facility: Facility, index: number) => {
    setSelectedFacility(facility);
    setActiveIndex(index);
  };

  return (
    <>
      <Navbar />
      <div className="facilities-page">
        <div className="facilities-hero">
          <h1 className="text-gradient">Fasilitas dan Layanan</h1>
          <p>
            Fasilitas lengkap dan modern untuk mendukung kegiatan belajar
            mengajar
          </p>
        </div>

        <div className="facilities-container">
          <div className="facilities-grid">
            {/* SIDEBAR UNTUK DESKTOP & TABLET */}
            <div className="facilities-sidebar desktop-sidebar">
              <div className="sidebar-title">Daftar Fasilitas</div>

              <div className="facility-list-wrapper">
                {facilities.map((facility, index) => (
                  <div
                    key={facility.id}
                    className={`facility-item ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onClick={() => handleFacilityClick(facility, index)}
                  >
                    <span className="facility-icon">{facility.icon}</span>
                    <span>{facility.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DROPDOWN UNTUK MOBILE */}
            <div className="mobile-dropdown">
              <select
                value={activeIndex}
                onChange={(e) => {
                  const index = Number(e.target.value);
                  handleFacilityClick(facilities[index], index);
                }}
              >
                {facilities.map((facility, index) => (
                  <option key={facility.id} value={index}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="facility-content">
              <div className="facility-detail-header">
                <div className="facility-detail-icon">
                  {selectedFacility.icon}
                </div>
                <div className="facility-detail-title">
                  <h2>{selectedFacility.name}</h2>
                  <span className="facility-badge">Fasilitas Unggulan</span>
                </div>
              </div>

              <div className="facility-image-container">
                <img
                  src={selectedFacility.image}
                  alt={selectedFacility.name}
                  className="facility-image"
                />
              </div>

              <div className="facility-description">
                <h3>Tentang Fasilitas</h3>
                <p>{selectedFacility.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
