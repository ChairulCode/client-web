import { useState, useEffect } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import ScrollLink from "react-scroll/modules/components/Link";

import Logo from "/assets/logo.svg";
import { navTabs2 } from "../../data";
import type { NavTab } from "../../data";
import { FaTimes } from "react-icons/fa";
import { RiMenu3Fill } from "react-icons/ri";
import gsap from "gsap";
import "./NavbarDetail.css";

interface NavbarDetailProps {
  level?: string;
}

const NavbarDetail: React.FC<NavbarDetailProps> = ({ level }) => {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1000);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("");

  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleScroll = () => setVisible(window.scrollY > 145);

  const handleDropdownClick = (tabId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdown(openDropdown === tabId ? null : tabId);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    const handleResize = () => setIsMobile(window.innerWidth <= 1000);
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".navbar-dropdown-container")) {
        setOpenDropdown(null);
      }
    };

    window.addEventListener("resize", handleResize);
    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (visible) {
      gsap.fromTo(
        ".navbar",
        { y: -250 },
        { y: 0, top: 0, duration: 0.6, ease: "power3.out" },
      );
    }
  }, [visible]);

  const closeMobileMenu = () => {
    setOpen(false);
    setOpenDropdown(null);
  };

  const GLOBAL_ROUTES = new Set([
    "/",
    "/Fasilitas",
    "/Lagu-Mars",
    "/pendaftaran-siswa",
    "/ekstrakurikuler",
    "/carousel-detail",
  ]);

  const getFinalPath = (tab: NavTab): string => {
    if (!tab.id) return "/";

    const rawId = String(tab.id);

    // TAMBAHKAN LOGIK INI:
    // Jika ID adalah portal-utama, paksa kembali ke root path "/"
    if (rawId === "halaman-utama") return "/";

    if (rawId === "/" || rawId === "home") {
      if (level) return `/tingkatan/${level}`;
      return "/";
    }

    if (GLOBAL_ROUTES.has(rawId)) return rawId;

    const cleaned = rawId.replace(/^\/+/, "");

    if (cleaned.startsWith("tingkatan/")) {
      return `/${cleaned}`;
    }

    if (level) return `/tingkatan/${level}/${cleaned}`;

    return `/${cleaned}`;
  };

  const isTabActive = (tab: NavTab) => {
    const id = String(tab.id);

    // scroll active
    if (activeSection === id) return true;

    // homepage scroll links
    if (isHome && tab.type === "scroll") return false;

    const finalPath = getFinalPath(tab);

    // match exact path only (fix double active)
    return location.pathname === finalPath;
  };

  const renderNavTabs = (tabs: NavTab[]) =>
    tabs.map((tab, index) => {
      const isActive = isTabActive(tab);

      if (tab.children && tab.children.length > 0) {
        return (
          <div key={index} className="navbar-dropdown-container">
            <p
              className={`navbar-dropdown-trigger ${
                openDropdown === tab.id ? "active" : ""
              }`}
              onClick={(e) => handleDropdownClick(tab.id, e)}
            >
              {tab.name}
            </p>

            <div
              className={`navbar-dropdown-menu ${
                openDropdown === tab.id ? "show" : ""
              }`}
            >
              {renderNavTabs(tab.children)}
            </div>
          </div>
        );
      }

      if (isHome && tab.type === "scroll") {
        return (
          <ScrollLink
            key={index}
            to={tab.id}
            smooth
            spy
            offset={-70}
            className={`tab ${isActive ? "active" : ""}`}
            onClick={closeMobileMenu}
          >
            <p>{tab.name}</p>
          </ScrollLink>
        );
      }

      if (tab.type === "link") {
        return (
          <ScrollLink
            key={index}
            to={tab.id}
            className={`tab ${isActive ? "active" : ""}`}
            onClick={() => {
              localStorage.setItem("scrollTo", tab.scrollTo || "");
              closeMobileMenu();
            }}
          >
            <p>{tab.name}</p>
          </ScrollLink>
        );
      }

      const finalPath = getFinalPath(tab);

      return (
        <RouterLink
          key={index}
          to={finalPath}
          className={`tab ${isActive ? "active" : ""}`}
          onClick={() => {
            localStorage.setItem("scrollTo", String(tab.id));
            closeMobileMenu();
          }}
        >
          <p>{tab.name}</p>
        </RouterLink>
      );
    });

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.35 },
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`navbar ${visible ? "visible" : ""}`}>
      {open && <div className="sidebar_overlay" onClick={closeMobileMenu} />}

      <img src={Logo} alt="Logo" className="img-logo" />

      <div className={`box nav_tabs ${open ? "open" : ""}`}>
        <div className="icon_container cancel_btn" onClick={closeMobileMenu}>
          <FaTimes />
        </div>

        {renderNavTabs(navTabs2)}

        {isMobile && (
          <RouterLink
            to="/pendaftaran-siswa"
            className="tab contact_tab_mobile"
            onClick={closeMobileMenu}
          >
            Pendaftaran Siswa Baru
          </RouterLink>
        )}
      </div>

      <div className="box buttons">
        {!isMobile && (
          <RouterLink to="/pendaftaran-siswa" className="btn contact_btn">
            Pendaftaran Siswa Baru
          </RouterLink>
        )}
        <div className="icon_container menu_btn" onClick={() => setOpen(!open)}>
          <RiMenu3Fill />
        </div>
      </div>
    </nav>
  );
};

export default NavbarDetail;
