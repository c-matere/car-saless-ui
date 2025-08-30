export default function Hero() {
  return (
    <section className="bg-gray-50 py-20 px-8 text-center">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
        Find Your Perfect Ride
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
        Browse through our premium selection of cars and book a test drive today.
      </p>
      <a href="#inventory" className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
        Explore Inventory
      </a>
    </section>
  );
}
