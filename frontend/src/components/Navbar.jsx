import React, { useState, useContext, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import SearchBar from "./SearchBar";
import { AuthContext } from "../context/AuthContext.jsx";
import { LayoutDashboard, User, ShoppingBag, LogOut } from "lucide-react";

const Navbar = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { authState, logout } = useContext(AuthContext);
  const { isAuthenticated, user, role } = authState;

  const isAdmin = Array.isArray(role) && role.includes("ADMIN");


  const menuItems = [
    { name: "Trang chủ", path: "/" },
    { name: "Sản phẩm", path: "/collection" },
    { name: "Giới thiệu", path: "/about" },
    { name: "Liên hệ", path: "/contact" },
  ];

  const handleSearch = (query) => {
    if (!query.trim()) return;
    navigate(`/collection?search=${encodeURIComponent(query)}`);
    setSearchVisible(false);
  };

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setSearchVisible(false);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-md" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* BRAND */}
          <Link to="/" className="flex items-center">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">NowWear</span>
          </Link>

          {/* MENU DESKTOP */}
          <ul className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {menuItems.map(item => (
              <NavLink key={item.path} to={item.path} className="group">
                {({ isActive }) => (
                  <span className={`text-lg font-bold relative pb-2 ${isActive ? "text-black" : "text-stone-600 hover:text-black"}`}>
                    {item.name}
                    {isActive
                      ? <span className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-full"></span>
                      : <span className="absolute bottom-0 left-0 w-0 h-1 bg-stone-800 rounded-full group-hover:w-full transition-all"></span>}
                  </span>
                )}
              </NavLink>
            ))}

            {/* DASHBOARD CHO ADMIN */}
            {isAdmin && (
              <NavLink to="/dashboard" className="group">
                {({ isActive }) => (
                  <span className={`text-lg font-bold relative pb-2 ${isActive ? "text-blue-600" : "text-stone-600 hover:text-black"}`}>
                    Dashboard
                    {isActive && <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full"></span>}
                  </span>
                )}
              </NavLink>
            )}
          </ul>

          {/* ICONS + PROFILE */}
          <div className="flex items-center gap-5">
            <button onClick={toggleSearch} className="p-2 rounded-full hover:bg-stone-100">
              <img src={assets.search_icon} className="w-6 h-6" />
            </button>

            <Link to="/cart" className="p-2 rounded-full hover:bg-stone-100">
              <img src={assets.cart_icon} className="w-6 h-6" />
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-stone-100">
                  <img src={assets.profile_icon} className="w-6 h-6" />
                  <span className="font-bold hidden sm:inline max-w-[120px] truncate">{user}</span>
                </button>

                {dropdownOpen && (
                  <ul className="absolute right-0 mt-3 w-56 bg-white shadow-xl rounded-xl border overflow-hidden">
                    {isAdmin && (
                      <li>
                        <Link
                          to="/dashboard"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-blue-600 font-medium hover:bg-blue-50 border-b"
                        >
                          <LayoutDashboard size={18} />
                          Dashboard Admin
                        </Link>
                      </li>
                    )}

                    <li>
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 font-medium hover:bg-stone-50"
                      >
                        <User size={18} />
                        Hồ sơ của tôi
                      </Link>
                    </li>

                    <li>
                      <Link
                        to="/orders"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 font-medium hover:bg-stone-50"
                      >
                        <ShoppingBag size={18} />
                        Đơn hàng
                      </Link>
                    </li>

                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-rose-600 hover:bg-rose-50 font-medium border-t"
                      >
                        <LogOut size={18} />
                        Đăng xuất
                      </button>
                    </li>
                  </ul>
                )}
              </div>
            ) : (
              <Link to="/login" className="p-2 rounded-full hover:bg-stone-100">
                <img src={assets.profile_icon} className="w-6 h-6" />
              </Link>
            )}

            <button onClick={toggleMobileMenu} className="lg:hidden p-2 rounded-full hover:bg-stone-100">
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor">
                  <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor">
                  <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* SEARCH BAR */}
        {searchVisible && (
          <div className="border-t py-4 px-4">
            <div className="flex items-center gap-3">
              <SearchBar onSearch={handleSearch} autoFocus />
              <button onClick={() => setSearchVisible(false)} className="p-2 rounded-full hover:bg-stone-200">✕</button>
            </div>
          </div>
        )}

        {/* MOBILE MENU */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t bg-white/90 backdrop-blur-md py-4">
            <ul className="space-y-2">
              {menuItems.map(item => (
                <NavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-lg font-semibold">
                  {item.name}
                </NavLink>
              ))}
              {isAdmin && (
                <NavLink to="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-lg font-bold text-blue-600">
                  Dashboard
                </NavLink>
              )}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
