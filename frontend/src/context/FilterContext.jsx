import React, { createContext, useContext, useState, useCallback } from "react";

const FilterContext = createContext();

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) throw new Error("useFilter must be used within a FilterProvider");
  return context;
};

export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    categories: [], // ["men", "women"]
    types: [],      // ["topwear", "bottomwear", "winterwear"]
  });

  // Cập nhật category
  const updateCategory = useCallback((category, checked) => {
    setFilters(prev => {
      const newCategories = checked
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category);
      return { ...prev, categories: newCategories };
    });
  }, []);

  // Cập nhật type
  const updateType = useCallback((type, checked) => {
    setFilters(prev => {
      const newTypes = checked
        ? [...prev.types, type]
        : prev.types.filter(t => t !== type);
      return { ...prev, types: newTypes };
    });
  }, []);

  // Hàm lọc sản phẩm theo category + type
  const filterProducts = useCallback((products) => {
    let filtered = [...products];

    // Lọc theo categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(p =>
        filters.categories.includes(p.categoryName?.toLowerCase())
      );
    }

    // Lọc theo types
    if (filters.types.length > 0) {
      filtered = filtered.filter(p =>
        filters.types.includes(p.type?.toLowerCase())
      );
    }

    return filtered;
  }, [filters]);

  const value = {
    filters,
    updateCategory,
    updateType,
    filterProducts,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};
