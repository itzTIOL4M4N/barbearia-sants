import { useRef, useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import BookingForm from "@/components/BookingForm";
import Footer from "@/components/Footer";

const Index = () => {
  const bookingRef = useRef<HTMLDivElement>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>();

  const scrollToBooking = () => {
    bookingRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    scrollToBooking();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onBookClick={scrollToBooking} />
      <main className="flex-1">
        <HeroSection onBookClick={scrollToBooking} />
        <ServicesSection onSelectService={handleSelectService} />
        <BookingForm selectedServiceId={selectedServiceId} formRef={bookingRef} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
