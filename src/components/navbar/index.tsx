import { useState, useEffect } from "react";
import { useLocation, Link as RouterLink } from "react-router-dom";
import ScrollLink from "react-scroll/modules/components/Link";
import Logo from "/assets/logo.svg";
import { navTabs } from "../../data";
import type { NavTab } from "../../data";
import { FaTimes } from "react-icons/fa";
import { RiMenu3Fill } from "react-icons/ri";
import gsap from "gsap";
import "./navbar.css";

const Navbar: React.FC = () => {
  const [visible, setVisible] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 1000);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const location = useLocation();
  const isHome = location.pathname === "/";

  const handleScroll = () => {
    const currentScrollPosition = window.scrollY;
    setVisible(currentScrollPosition > 145);
  };

  const handleDropdownClick = (tabId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setOpenDropdown(openDropdown === tabId ? null : tabId);
  };

  const isTabActive = (tab: NavTab): boolean => {
    if (location.pathname === tab.id) {
      return true;
    }

    // Check apakah ada child yang aktif
    if (tab.children && tab.children.length > 0) {
      return tab.children.some((child) => location.pathname === child.id);
    }

    return false;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
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
  }, []);

  useEffect(() => {
    if (visible) {
      // Animasi muncul dari atas
      gsap.fromTo(
        ".navbar.visible",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      );
    } else {
      gsap.set(".navbar", { y: 0, opacity: 1 });
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [visible]);

  const closeMobileMenu = () => {
    setOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className={`navbar ${visible ? "visible" : ""}`}>
      {open && (
        <div className="sidebar_overlay" onClick={closeMobileMenu}></div>
      )}
      <img src={Logo} alt="Logo" className="img-logo !w-20 h-auto" />
      <div className={`box nav_tabs ${open ? "open" : ""}`}>
        <div className="icon_container cancel_btn" onClick={closeMobileMenu}>
          <FaTimes />
        </div>

        {navTabs.map((tab: NavTab, index: number) => {
          const isActive = isTabActive(tab);

          if (tab.children && tab.children.length > 0) {
            return (
              <div key={index} className="navbar-dropdown-container">
                <div
                  className={`navbar-dropdown-trigger ${
                    isActive ? "active" : ""
                  }`}
                  onClick={(e) => handleDropdownClick(tab.id, e)}
                >
                  <p>{tab.name}</p>
                </div>

                <div
                  className={`navbar-dropdown-menu ${
                    openDropdown === tab.id ? "show" : ""
                  }`}
                >
                  {tab.children.map((child: NavTab, i: number) => (
                    <RouterLink
                      key={i}
                      to={child.id}
                      className={`navbar-dropdown-item ${
                        location.pathname === child.id ? "active" : ""
                      }`}
                      onClick={closeMobileMenu}
                    >
                      {child.name}
                    </RouterLink>
                  ))}
                </div>
              </div>
            );
          }

          if (isHome && tab.type === "scroll") {
            return (
              <ScrollLink
                key={index}
                to={tab.id}
                className={`tab ${isActive ? "active" : ""}`}
                activeClass="active"
                smooth={true}
                spy={true}
                offset={-70}
                onClick={closeMobileMenu}
              >
                <p>{tab.name}</p>
              </ScrollLink>
            );
          } else if (tab.type === "link") {
            return (
              <RouterLink
                key={index}
                to={tab.id}
                className={`tab ${isActive ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <p>{tab.name}</p>
              </RouterLink>
            );
          } else {
            return (
              <RouterLink
                key={index}
                to={tab.id}
                className={`tab ${isActive ? "active" : ""}`}
                onClick={closeMobileMenu}
              >
                <p>{tab.name}</p>
              </RouterLink>
            );
          }
        })}

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

export default Navbar;
