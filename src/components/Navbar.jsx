export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 bg-white shadow">
      <div className="text-2xl font-bold text-gray-800">CarYard</div>
      <ul className="hidden md:flex space-x-8 text-gray-600 font-medium">
        <li><a href="#" className="hover:text-blue-600">Home</a></li>
        <li><a href="#" className="hover:text-blue-600">Inventory</a></li>
        <li><a href="#" className="hover:text-blue-600">Services</a></li>
        <li><a href="#" className="hover:text-blue-600">Contact</a></li>
      </ul>
      <a href="#" className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition">
        Book a Test Drive
      </a>
    </nav>
  );
}
