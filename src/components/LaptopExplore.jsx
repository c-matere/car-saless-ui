import React, { useState } from "react";

// Placeholder SVG components for icons
const ArrowRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 15L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const DropdownArrow = () => (
  <svg width="16" height="10" viewBox="0 0 16 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 1L8 8L15 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Placeholder car image
const CarImage = () => (
  <div className="w-full max-w-[735px] h-[333px] bg-gray-800 rounded-lg flex items-center justify-center">
    <span className="text-gray-500">Car Image</span>
  </div>
);

const LaptopExplore = ({ onBack }) => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedPrice, setSelectedPrice] = useState("");

  const navigationItems = [
    { label: "HOME", active: true },
    { label: "About us", active: false },
    { label: "BLOG", active: false },
    { label: "INVENTORY", active: false },
  ];

  const filterOptions = ["All", "USED", "NEW"];

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
  };

  const handleSearch = () => {
    console.log("Searching with:", {
      selectedMake,
      selectedModel,
      selectedPrice,
    });
  };

  return (
    <div className="bg-[#1d1d1d] min-h-screen w-full flex justify-center items-start pt-8">
      <div className="w-[1280px] relative">
        {/* Back button */}
        <button 
          onClick={onBack}
          className="mb-6 px-4 py-2 bg-[#2e2e2e] text-white rounded-lg hover:bg-[#3e3e3e] transition-colors flex items-center gap-2"
        >
          <span>←</span> Back to Home
        </button>

        {/* Main content */}
        <div className="relative w-full">
          {/* Main car image and search section */}
          <div className="w-full flex justify-center mb-12">
            <div className="relative w-full max-w-[735px]">
              <CarImage />

              {/* Search bar */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[359px]">
                <div className="relative w-full h-[67px] bg-[#2e2e2e] rounded-[38px] overflow-hidden">
                  <input
                    type="text"
                    placeholder="explore vehicles"
                    className="w-full h-full pl-12 pr-16 bg-transparent text-white text-xl font-medium outline-none placeholder-white"
                  />
                  <button
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-8 h-8 flex items-center justify-center"
                    aria-label="Search"
                    onClick={handleSearch}
                  >
                    <div className="relative w-6 h-6">
                      <div className="absolute w-5 h-5 rounded-full border-2 border-white" />
                      <SearchIcon />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-center text-3xl md:text-4xl font-semibold text-white mb-12">
            <span>FIND</span>
            <span className="text-[#ffb600]"> A CAR FOR SALE</span>
            <span> IN MOMBASA, FAST, RELIABLE AND EASY</span>
          </h1>

          {/* Filter buttons */}
          <div className="flex justify-center gap-6 mb-8">
            {filterOptions.map((filter) => (
              <button
                key={filter}
                className={`px-8 py-2 rounded-2xl text-lg font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-[#ffb600] text-black'
                    : 'bg-[#2e2e2e] text-white hover:bg-[#3e3e3e]'
                }`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Search filters section */}
          <div className="bg-[#2f2f2f] rounded-xl p-6 mb-12 border border-gray-700/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Make</label>
                <div className="relative">
                  <select 
                    className="w-full p-3 bg-gray-700/50 text-gray-100 rounded-lg appearance-none pr-10 text-sm border border-gray-600/50 focus:border-[#ffb600] focus:ring-1 focus:ring-[#ffb600]/30 transition-all outline-none"
                    value={selectedMake}
                    onChange={(e) => setSelectedMake(e.target.value)}
                  >
                    <option value="">Select Make</option>
                    <option value="toyota">Toyota</option>
                    <option value="honda">Honda</option>
                    <option value="nissan">Nissan</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Model</label>
                <div className="relative">
                  <select 
                    className={`w-full p-3 bg-[#3a3a3a] text-gray-100 rounded-lg appearance-none pr-10 text-sm border ${!selectedMake ? 'opacity-50 cursor-not-allowed' : 'border-gray-600/30'} focus:border-[#ffb600] focus:ring-1 focus:ring-[#ffb600]/30 transition-all outline-none`}
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                    disabled={!selectedMake}
                  >
                    <option value="">Select Model</option>
                    <option value="premio">Premio</option>
                    <option value="vitz">Vitz</option>
                    <option value="harrier">Harrier</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                <div className="relative">
                  <select 
                    className="w-full p-3 bg-gray-700/50 text-gray-100 rounded-lg appearance-none pr-10 text-sm border border-gray-600/50 focus:border-[#ffb600] focus:ring-1 focus:ring-[#ffb600]/30 transition-all outline-none"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                  >
                    <option value="">Select Price Range</option>
                    <option value="0-500000">Under 500K KES</option>
                    <option value="500000-1000000">500K - 1M KES</option>
                    <option value="1000000-2000000">1M - 2M KES</option>
                    <option value="2000000">Over 2M KES</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </div>
              </div>

              <button
                className="h-[46px] bg-[#ffb600] hover:bg-[#e6a500] text-gray-900 font-medium rounded-lg flex items-center justify-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffb600]/50 focus:ring-offset-2 focus:ring-offset-[#2f2f2f]"
                onClick={handleSearch}
              >
                <span>Search</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaptopExplore;
