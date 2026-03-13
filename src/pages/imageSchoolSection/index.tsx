const ImageschoolSection = () => {
  return (
    <section
      style={{
        position: "relative",
        padding: "80px 64px",
        overflow: "hidden",
        // ✅ Background disesuaikan dengan welcome.tsx (navy/indigo gelap)
        background: "#1e2070",
      }}
    >
      {/* bg-circle-1 — mirip welcome.css */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          pointerEvents: "none",
          background: "rgba(100, 100, 160, 0.35)",
          filter: "blur(40px)",
        }}
      />

      {/* bg-circle-2 */}
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: 420,
          height: 420,
          borderRadius: "50%",
          pointerEvents: "none",
          background: "rgba(80, 80, 150, 0.25)",
          filter: "blur(50px)",
        }}
      />

      {/* bg-circle-3 */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          right: "30%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          pointerEvents: "none",
          background: "rgba(120, 120, 180, 0.15)",
          filter: "blur(60px)",
        }}
      />

      {/* Dot pattern */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
          opacity: 0.25,
        }}
      />

      {/* Top accent bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          background: "linear-gradient(to right, #ddc588, #9fc4e8, #ddc588)",
        }}
      />

      <div style={{ position: "relative", width: "100%" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingBottom: 40,
            marginBottom: 48,
            borderBottom: "1px solid rgba(221,197,136,0.2)",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 2,
                  background: "linear-gradient(to right, #ddc588, #9fc4e8)",
                  borderRadius: 2,
                }}
              />
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.35em",
                  color: "#ddc588",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Perguruan WR Supratman
              </p>
            </div>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 44,
                fontWeight: 900,
                lineHeight: 1.1,
                margin: 0,
                color: "#f5f0e8",
              }}
            >
              Lingkungan{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #ddc588, #9fc4e8)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Sekolah Kami
              </span>
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 10,
            }}
          >
            <div
              style={{
                padding: "6px 18px",
                borderRadius: 999,
                border: "1px solid rgba(159,196,232,0.3)",
                background: "rgba(159,196,232,0.08)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: "#9fc4e8",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
              >
                Medan · Sumatera Utara
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "rgba(245,240,232,0.5)",
                maxWidth: 200,
                textAlign: "right",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Fasilitas terbaik untuk generasi penerus bangsa.
            </p>
          </div>
        </div>

        {/* Cards Row */}
        <div style={{ display: "flex", flexDirection: "row", gap: 24 }}>
          {/* Card 1 */}
          <div
            style={{
              flex: 1,
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(221,197,136,0.2)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(-6px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 32px 64px rgba(221,197,136,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 24px 60px rgba(0,0,0,0.5)";
            }}
          >
            <img
              src="/assets/img-sekolah-1.jpeg"
              alt="Gedung Utama"
              style={{
                width: "100%",
                height: 460,
                objectFit: "cover",
                display: "block",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </div>

          {/* Card 2 */}
          <div
            style={{
              flex: 1,
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(159,196,232,0.2)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
              transition: "transform 0.4s ease, box-shadow 0.4s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(-6px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 32px 64px rgba(159,196,232,0.2)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform =
                "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow =
                "0 24px 60px rgba(0,0,0,0.5)";
            }}
          >
            <img
              src="/assets/img-sekolah-2.jpeg"
              alt="Area Pendukung"
              style={{
                width: "100%",
                height: 460,
                objectFit: "cover",
                display: "block",
                transition: "transform 0.7s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.04)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageschoolSection;
