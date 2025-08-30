import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import CarCard from "../components/CarCard";

export default function Home() {
  const cars = [
    { image: "/car1.jpg", title: "Toyota Corolla", price: "$20,000" },
    { image: "/car2.jpg", title: "Honda Civic", price: "$22,000" },
    { image: "/car3.jpg", title: "Ford Mustang", price: "$35,000" },
  ];

  return (
    <>
      <Navbar />
      <Hero />
      <section id="inventory" className="py-16 px-8 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-12">Our Inventory</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {cars.map((car, i) => (
            <CarCard key={i} {...car} />
          ))}
        </div>
      </section>
      <Features />
      <Testimonials />
      <Footer />
    </>
  );
}
