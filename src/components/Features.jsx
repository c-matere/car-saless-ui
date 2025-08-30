export default function Features() {
  return (
    <section className="py-16 px-8 bg-white">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="text-center p-6 bg-gray-50 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
          <p className="text-gray-600">Choose from a large variety of cars for every budget and style.</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-2">Trusted Dealers</h3>
          <p className="text-gray-600">Work only with verified and reliable dealerships.</p>
        </div>
        <div className="text-center p-6 bg-gray-50 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-2">Flexible Financing</h3>
          <p className="text-gray-600">Get the car you love with financing options tailored to you.</p>
        </div>
      </div>
    </section>
  );
}
