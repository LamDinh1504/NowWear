// import React, { useState, useContext, useEffect, useRef } from 'react';
// import { NavLink, Link, useNavigate } from 'react-router-dom';
// import { assets } from '../assets/assets.js';
// import SearchBar from './SearchBar';
// import { AuthContext } from '../context/AuthContext.jsx';

// const Navbar = () => {
//   const [searchVisible, setSearchVisible] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const dropdownRef = useRef(null);
//   const navigate = useNavigate();

//   const { authState, logout } = useContext(AuthContext);
//   const { isAuthenticated, user } = authState;

//   const handleSearch = (query) => {
//     if (!query.trim()) return;
//     navigate(`/collection?search=${encodeURIComponent(query)}`);
//     setSearchVisible(false);
//   };

//   const handleLogout = () => {
//     logout();
//     setDropdownOpen(false);
//     navigate("/login");
//   };

//   const toggleSearch = () => {
//     setSearchVisible(prev => !prev);
//     setMobileMenuOpen(false);
//   };

//   const toggleMobileMenu = () => {
//     setMobileMenuOpen(prev => !prev);
//     setSearchVisible(false);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);

//     const handleScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handleScroll);

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   const menuItems = [
//     { name: 'Trang chủ', path: '/' },
//     { name: 'Sản phẩm', path: '/collection' },
//     { name: 'Giới thiệu', path: '/about' },
//     { name: 'Liên hệ', path: '/contact' },
//   ];

//   return (
//     <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white'}`}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-20">

//           {/* Brand */}
//           <Link to="/" className="flex items-center shrink-0 group">
//             <span className="text-3xl sm:text-4xl font-serif tracking-wider text-stone-900 group-hover:text-rose-500 transition-colors duration-300">
//               NowWear
//             </span>
//           </Link>

//           {/* Menu Desktop */}
//           <ul className="hidden lg:flex items-center gap-10 absolute left-1/2 transform -translate-x-1/2">
//             {menuItems.map(item => (
//               <NavLink key={item.path} to={item.path} className="group relative">
//                 {({ isActive }) => (
//                   <span
//                     className={`text-lg sm:text-xl font-bold tracking-wide relative pb-2 transition-all duration-300
//                       ${isActive ? 'text-black' : 'text-stone-600 hover:text-black'}
//                     `}
//                   >
//                     {item.name}
//                     {isActive && <span className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-full transition-all duration-300" />}
//                     {!isActive && <span className="absolute bottom-0 left-0 w-0 h-1 bg-stone-800 rounded-full transition-all duration-300 group-hover:w-full" />}
//                   </span>
//                 )}
//               </NavLink>
//             ))}
//           </ul>

//           {/* Icons + Profile */}
//           <div className="flex items-center gap-4 sm:gap-6">
//             {/* Search */}
//             <button onClick={toggleSearch} className="p-2 hover:bg-stone-50 rounded-full transition-all duration-200 group">
//               <img src={assets.search_icon || "/placeholder.svg"} className="w-6 h-6 text-stone-600 group-hover:scale-110 transition-transform" alt="Search" />
//             </button>

//             {/* Cart (xóa số lượng) */}
//             <Link to="/cart" className="p-2 hover:bg-stone-50 rounded-full transition-all duration-200 group relative">
//               <img src={assets.cart_icon || "/placeholder.svg"} className="w-6 h-6 text-stone-600 group-hover:scale-110 transition-transform" alt="Cart" />
//             </Link>

//             {/* Profile */}
//             {isAuthenticated ? (
//               <div className="relative" ref={dropdownRef}>
//                 <button onClick={() => setDropdownOpen(prev => !prev)} className="flex items-center gap-2 px-3 py-2 hover:bg-stone-50 rounded-full transition-all duration-200 group">
//                   <img src={assets.profile_icon || "/placeholder.svg"} alt="Profile" className="w-6 h-6 text-stone-600 group-hover:scale-110 transition-transform" />
//                   <span className="text-lg font-bold text-stone-900 hidden sm:inline truncate max-w-[120px]">{user}</span>
//                 </button>

//                 {dropdownOpen && (
//                   <ul className="absolute right-0 mt-3 w-48 bg-white border border-stone-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in duration-150">
//                     <li>
//                       <Link
//                         to="/profile"
//                         onClick={() => setDropdownOpen(false)}
//                         className="block px-4 py-3 text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-rose-500 transition-colors"
//                       >
//                         Hồ sơ của tôi
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         to="/settings"
//                         onClick={() => setDropdownOpen(false)}
//                         className="block px-4 py-3 text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-rose-500 transition-colors border-t border-stone-100"
//                       >
//                         Cài đặt
//                       </Link>
//                     </li>
//                     <li>
//                       <Link
//                         to="/orders"
//                         onClick={() => setDropdownOpen(false)}
//                         className="block px-4 py-3 text-base font-medium text-stone-700 hover:bg-stone-50 hover:text-rose-500 transition-colors border-t border-stone-100"
//                       >
//                         Đơn hàng
//                       </Link>
//                     </li>
//                     <li>
//                       <button
//                         onClick={handleLogout}
//                         className="w-full text-left px-4 py-3 text-base font-medium text-rose-600 hover:bg-rose-50 transition-colors border-t border-stone-100"
//                       >
//                         Đăng xuất
//                       </button>
//                     </li>

//                   </ul>
//                 )}
//               </div>
//             ) : (
//               <Link to="/login" className="p-2 hover:bg-stone-50 rounded-full transition-all duration-200 group">
//                 <img className="w-6 h-6 text-stone-600 group-hover:scale-110 transition-transform" src={assets.profile_icon || "/placeholder.svg"} alt="Profile" />
//               </Link>
//             )}

//             {/* Mobile Menu */}
//             <button onClick={toggleMobileMenu} className="lg:hidden p-2 hover:bg-stone-50 rounded-full transition-all">
//               {mobileMenuOpen ? (
//                 <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               ) : (
//                 <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Search Bar */}
//         {searchVisible && (
//           <div className="border-t border-stone-100 px-4 py-4 animate-in fade-in duration-200">
//             <div className="flex items-center gap-3">
//               <SearchBar onSearch={handleSearch} autoFocus={true} />
//               <button onClick={() => setSearchVisible(false)} className="p-2 hover:bg-stone-100 rounded-full transition-colors shrink-0">
//                 <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Mobile Menu */}
//         {mobileMenuOpen && (
//           <div className="lg:hidden border-t border-stone-100 py-4 animate-in fade-in duration-200 backdrop-blur-sm bg-white/80">
//             <ul className="space-y-2">
//               {menuItems.map(item => (
//                 <NavLink key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)} className="group">
//                   {({ isActive }) => (
//                     <span className={`block px-4 py-3 rounded-lg text-lg font-bold relative pb-2 transition-all duration-300 ${isActive ? 'text-black' : 'text-stone-600 hover:text-black'}`}>
//                       {item.name}
//                       {isActive && <span className="absolute bottom-0 left-0 w-full h-1 bg-black rounded-full transition-all duration-300" />}
//                       {!isActive && <span className="absolute bottom-0 left-0 w-0 h-1 bg-stone-800 rounded-full transition-all duration-300 group-hover:w-full" />}
//                     </span>
//                   )}
//                 </NavLink>
//               ))}
//             </ul>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



import React, { useState, useContext, useEffect, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import SearchBar from "./SearchBar";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const [searchVisible, setSearchVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const { authState, logout } = useContext(AuthContext);
  const { isAuthenticated, user, role } = authState;

  // Kiểm tra admin
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
                  <ul className="absolute right-0 mt-3 w-48 bg-white shadow-lg rounded-xl border">
                    {isAdmin && (
                      <li>
                        <Link to="/dashboard" className="block px-4 py-3 text-blue-600 font-medium hover:bg-blue-50 border-b" onClick={() => setDropdownOpen(false)}>Dashboard Admin</Link>
                      </li>
                    )}
                    <li>
                      <Link to="/profile" className="block px-4 py-3 font-medium hover:bg-stone-50" onClick={() => setDropdownOpen(false)}>Hồ sơ của tôi</Link>
                    </li>
                    <li>
                      <Link to="/orders" className="block px-4 py-3 font-medium hover:bg-stone-50" onClick={() => setDropdownOpen(false)}>Đơn hàng</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-rose-600 hover:bg-rose-50 font-medium border-t">Đăng xuất</button>
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
