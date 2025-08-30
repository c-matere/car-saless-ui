export default function CarCard({ image, title, price }) {
  return (
    <div className="bg-white rounded-2xl shadow hover:shadow-lg transition p-4">
      <img src={image} alt={title} className="rounded-lg mb-4 w-full h-48 object-cover" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">Starting at {price}</p>
      <a href="#" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
        View Details
      </a>
    </div>
  );
}
