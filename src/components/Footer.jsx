export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 px-8">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">CarYard</h3>
          <p>Find your perfect car with ease. Trusted by thousands of happy customers.</p>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white">Home</a></li>
            <li><a href="#" className="hover:text-white">Inventory</a></li>
            <li><a href="#" className="hover:text-white">Services</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-4">Contact</h4>
          <p>Email: support@caryard.com</p>
          <p>Phone: +254 700 000 000</p>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-4">Follow Us</h4>
          <p>Social icons go here</p>
        </div>
      </div>
      <div className="text-center mt-12 text-gray-500 text-sm">
        © {new Date().getFullYear()} CarYard. All rights reserved.
      </div>
    </footer>
  );
}
