import React, { useState } from 'react';
import { assets } from '../assets/assets.js';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (onSearch) onSearch(query);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition"
      />
      <button
        onClick={handleSearch}
        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-pink-500 transition"
      >
        <img src={assets.search_icon} alt="Search" className="w-5 h-5" />
      </button>
    </div>
  );
};

export default SearchBar;


