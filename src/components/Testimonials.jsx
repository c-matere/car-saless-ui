export default function Testimonials() {
  return (
    <section className="py-16 px-8 bg-gray-50">
      <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 mb-4">"Great service and an amazing selection of cars. Found my dream car here!"</p>
          <h4 className="font-semibold">John Doe</h4>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 mb-4">"Smooth process from start to finish. Highly recommend CarYard!"</p>
          <h4 className="font-semibold">Jane Smith</h4>
        </div>
      </div>
    </section>
  );
}
