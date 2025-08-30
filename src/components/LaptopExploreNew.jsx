import React, { useState } from 'react';

// Icons
const ChevronDown = ({ className = '' }) => (
  <svg className={`w-4 h-4 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const SearchIcon = ({ className = '' }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = ({ className = '' }) => (
  <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

// Placeholder car image
const CarImage = () => (
  <div className="w-full h-64 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl flex items-center justify-center">
    <div className="text-center">
      <div className="text-gray-600 text-sm mb-1">PREVIEW</div>
      <div className="w-12 h-0.5 bg-[#ffb600] mx-auto mb-4"></div>
      <div className="text-gray-400 text-sm">3D Model Loading</div>
    </div>
  </div>
);

const LaptopExplore = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    type: "all",
    make: "",
    model: "",
    price: ""
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const carMakes = ["Toyota", "Honda", "Nissan", "Mazda", "Subaru"];
  const carModels = {
    "Toyota": ["Camry", "Corolla", "RAV4", "Land Cruiser"],
    "Honda": ["Civic", "Accord", "CR-V", "Pilot"],
    "Nissan": ["Altima", "Rogue", "X-Trail", "Patrol"],
    "Mazda": ["CX-5", "3", "6", "CX-9"],
    "Subaru": ["Outback", "Forester", "Impreza", "Crosstrek"]
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching with:", { ...filters, searchQuery });
  };
  
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      ...(key === 'make' && { model: '' }) // Reset model when make changes
    }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
            <h1 className="text-2xl font-medium">Find Your Car</h1>
            <div className="w-8"></div> {/* For balance */}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <SearchIcon className="text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a car..."
              className="w-full bg-gray-800 rounded-lg py-4 pl-12 pr-6 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ffb600] focus:border-transparent"
            />
          </form>
        </div>

        {/* Car Preview */}
        <div className="mb-8">
          <CarImage />
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {['All', 'Used', 'New', 'Certified'].map((type) => (
              <button
                key={type}
                onClick={() => handleFilterChange('type', type.toLowerCase())}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  filters.type === type.toLowerCase() 
                    ? 'bg-[#ffb600] text-gray-900' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            <FilterIcon className="mr-2" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-gray-800 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-medium mb-4">Filter by</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Make Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Make</label>
                <div className="relative">
                  <select
                    value={filters.make}
                    onChange={(e) => handleFilterChange('make', e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg py-2.5 px-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-[#ffb600]"
                  >
                    <option value="">Select Make</option>
                    {carMakes.map(make => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Model Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Model</label>
                <div className="relative">
                  <select
                    value={filters.model}
                    onChange={(e) => handleFilterChange('model', e.target.value)}
                    disabled={!filters.make}
                    className={`w-full bg-gray-700 text-white rounded-lg py-2.5 px-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-[#ffb600] ${
                      !filters.make ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <option value="">Select Model</option>
                    {filters.make && carModels[filters.make]?.map(model => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Price Range Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Price Range</label>
                <div className="relative">
                  <select
                    value={filters.price}
                    onChange={(e) => handleFilterChange('price', e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-lg py-2.5 px-4 pr-10 appearance-none focus:outline-none focus:ring-2 focus:ring-[#ffb600]"
                  >
                    <option value="">Select Price Range</option>
                    <option value="0-500000">Under 500,000 KES</option>
                    <option value="500000-1000000">500K - 1M KES</option>
                    <option value="1000000-2000000">1M - 2M KES</option>
                    <option value="2000000">Over 2M KES</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setFilters({ type: 'all', make: '', model: '', price: '' });
                  setSearchQuery('');
                }}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="px-6 py-2 bg-[#ffb600] text-gray-900 font-medium rounded-lg hover:bg-[#e6a500] transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Results Section */}
        <div className="mt-12">
          <h2 className="text-xl font-medium mb-6">Available Vehicles</h2>
          <div className="text-center py-12 text-gray-500">
            <p>Use the filters above to find your perfect car</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LaptopExplore;
