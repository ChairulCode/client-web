import HeaderInfoImage from "/assets/header-info-img.jpg";

const HeaderInfo = () => {
  return (
    <section
      className="w-full"
      style={{
        position: "relative",
        background: "linear-gradient(135deg, #1e3a8a, #3730a3, #7c3aed)",
        overflow: "hidden",
      }}
    >
      {/* ── Dot pattern overlay (sama persis dengan footer) ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ddc588' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundColor: "rgba(221, 197, 136, 0.05)",
          pointerEvents: "none",
        }}
      />

      {/* ── Elemen dekoratif bulat — sama dengan .footer-bg-element ── */}
      <div
        style={{
          position: "absolute",
          top: "2.5rem",
          left: "2.5rem",
          width: "5rem",
          height: "5rem",
          borderRadius: "50%",
          backgroundColor: "#fbbf24",
          opacity: 0.2,
          animation: "pulse 2s infinite",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "8rem",
          right: "5rem",
          width: "4rem",
          height: "4rem",
          borderRadius: "50%",
          backgroundColor: "#34d399",
          opacity: 0.2,
          animation: "bounce 2s infinite",
          animationDelay: "1s",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "5rem",
          left: "25%",
          width: "3rem",
          height: "3rem",
          borderRadius: "50%",
          backgroundColor: "#f472b6",
          opacity: 0.2,
          animation: "pulse 2s infinite",
          animationDelay: "2s",
          pointerEvents: "none",
        }}
      />

      {/* ── Konten gambar ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <img
          src={HeaderInfoImage}
          alt="Header"
          style={{
            width: "50%",
            display: "block",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      </div>
    </section>
  );
};

export default HeaderInfo;
