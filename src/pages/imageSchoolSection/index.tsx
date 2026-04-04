import { useState, useEffect } from "react";

// ─── Breakpoint helpers ───────────────────────────────────────
const getBreakpoint = (w: number) => {
  if (w < 480) return "xs"; // Mobile kecil
  if (w < 768) return "sm"; // Mobile
  if (w < 1024) return "md"; // Tablet
  return "lg"; // Desktop
};

const ImageschoolSection = () => {
  const [bp, setBp] = useState(() => getBreakpoint(window.innerWidth));

  useEffect(() => {
    const onResize = () => setBp(getBreakpoint(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = bp === "xs" || bp === "sm";
  const isTablet = bp === "md";
  const isDesktop = bp === "lg";

  // ─── Responsive values ───────────────────────────────────────
  const sectionPadding = isDesktop
    ? "80px 64px"
    : isTablet
      ? "60px 40px"
      : bp === "sm"
        ? "48px 24px"
        : "40px 16px";

  const headingSize = isDesktop ? 44 : isTablet ? 36 : bp === "sm" ? 28 : 24;

  const cardsDirection: React.CSSProperties["flexDirection"] =
    isMobile || isTablet ? "column" : "row";

  const imgHeight = isDesktop ? 460 : isTablet ? 320 : bp === "sm" ? 240 : 200;

  const headerLayout: React.CSSProperties = isMobile
    ? { flexDirection: "column", alignItems: "flex-start", gap: 16 }
    : {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-between",
      };

  const subtextAlign: React.CSSProperties["textAlign"] = isMobile
    ? "left"
    : "right";

  // ─── Hover state per card ─────────────────────────────────────
  const [hover, setHover] = useState<number | null>(null);

  const cardStyle = (i: number, borderColor: string): React.CSSProperties => ({
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    border: `1px solid ${borderColor}`,
    boxShadow:
      hover === i
        ? i === 0
          ? "0 32px 64px rgba(221,197,136,0.22)"
          : "0 32px 64px rgba(159,196,232,0.22)"
        : "0 24px 60px rgba(0,0,0,0.5)",
    transform: hover === i ? "translateY(-6px)" : "translateY(0)",
    transition: "transform 0.4s ease, box-shadow 0.4s ease",
    cursor: "pointer",
  });

  const [imgHover, setImgHover] = useState<number | null>(null);

  const imgStyle = (i: number): React.CSSProperties => ({
    width: "100%",
    height: imgHeight,
    objectFit: "cover",
    display: "block",
    transform: imgHover === i ? "scale(1.04)" : "scale(1)",
    transition: "transform 0.7s ease",
  });

  return (
    <section
      style={{
        position: "relative",
        padding: sectionPadding,
        overflow: "hidden",
        background: "#1e2070",
      }}
    >
      {/* ── Blob dekoratif ── */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: isMobile ? 280 : 500,
          height: isMobile ? 280 : 500,
          borderRadius: "50%",
          pointerEvents: "none",
          background: "rgba(100,100,160,0.35)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: isMobile ? 240 : 420,
          height: isMobile ? 240 : 420,
          borderRadius: "50%",
          pointerEvents: "none",
          background: "rgba(80,80,150,0.25)",
          filter: "blur(50px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          right: "30%",
          width: isMobile ? 160 : 280,
          height: isMobile ? 160 : 280,
          borderRadius: "50%",
          pointerEvents: "none",
          background: "rgba(120,120,180,0.15)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Dot pattern ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.25,
        }}
      />

      {/* ── Top accent bar ── */}
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
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            ...headerLayout,
            paddingBottom: isMobile ? 28 : 40,
            marginBottom: isMobile ? 32 : 48,
            borderBottom: "1px solid rgba(221,197,136,0.2)",
          }}
        >
          {/* Judul kiri */}
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
                  fontSize: isMobile ? 10 : 11,
                  fontWeight: 700,
                  letterSpacing: "0.35em",
                  color: "#ddc588",
                  textTransform: "uppercase",
                  margin: 0,
                }}
              >
                Perguruan WR Supratman 1 Medan
              </p>
            </div>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: headingSize,
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
                Sekolah Kami, Perguruan WR Supratman 1 Medan
              </span>
            </h2>
          </div>

          {/* Subtext kanan */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMobile ? "flex-start" : "flex-end",
              gap: 10,
              marginTop: isMobile ? 4 : 0,
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
                  fontSize: isMobile ? 10 : 11,
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
                fontSize: isMobile ? 12 : 13,
                color: "rgba(245,240,232,0.5)",
                maxWidth: isMobile ? "100%" : 200,
                textAlign: subtextAlign,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Tempat terbaik untuk generasi penerus bangsa.
            </p>
          </div>
        </div>

        {/* ── Cards ── */}
        <div
          style={{
            display: "flex",
            flexDirection: cardsDirection,
            gap: isMobile ? 16 : isTablet ? 20 : 24,
          }}
        >
          {/* Card 1 */}
          <div
            style={cardStyle(0, "rgba(221,197,136,0.2)")}
            onMouseEnter={() => setHover(0)}
            onMouseLeave={() => setHover(null)}
          >
            <img
              src="/assets/img-sekolah-1.jpeg"
              alt="Gedung Utama"
              style={imgStyle(0)}
              onMouseEnter={() => setImgHover(0)}
              onMouseLeave={() => setImgHover(null)}
            />
          </div>

          {/* Card 2 */}
          <div
            style={cardStyle(1, "rgba(159,196,232,0.2)")}
            onMouseEnter={() => setHover(1)}
            onMouseLeave={() => setHover(null)}
          >
            <img
              src="/assets/img-sekolah-2.jpeg"
              alt="Area Pendukung"
              style={imgStyle(1)}
              onMouseEnter={() => setImgHover(1)}
              onMouseLeave={() => setImgHover(null)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageschoolSection;
