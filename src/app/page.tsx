import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchBar from "@/components/SearchBar";
import CourseCards from "@/components/CourseCards";
import VideoSection from "@/components/VideoSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <div className="px-4">
          <SearchBar />
        </div>
        <CourseCards />
        <VideoSection />
      </main>
      <Footer />
    </>
  );
}