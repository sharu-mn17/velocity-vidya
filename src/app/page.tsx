import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CourseCards from "@/components/CourseCards";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <CourseCards />
        <section id="videos" />
      </main>
      <Footer />
    </>
  );
}