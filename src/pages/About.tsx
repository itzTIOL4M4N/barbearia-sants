import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Clock, Phone, Award } from "lucide-react";

const About = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
      <h1 className="text-4xl md:text-5xl font-heading font-semibold text-primary text-center mb-6">
        Sobre a BarberKing
      </h1>
      <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
        Há mais de uma década oferecendo a melhor experiência em barbearia tradicional,
        unindo técnica clássica e tendências modernas para realçar o melhor de cada cliente.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: <MapPin />, title: "Localização", text: "Rua das Tesouras, 123 — Centro" },
          { icon: <Clock />, title: "Horário", text: "Seg a Sáb · 09h às 20h" },
          { icon: <Phone />, title: "Contato", text: "(11) 99999-9999" },
          { icon: <Award />, title: "Experiência", text: "+10 anos de tradição" },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-xl bg-card border border-border flex gap-4">
            <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-primary-foreground shrink-0">
              {item.icon}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default About;
