import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MapPin, Clock, Instagram, Award } from "lucide-react";

const About = () => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 max-w-4xl mx-auto px-6 py-16 w-full">
      <h1 className="text-4xl md:text-5xl font-heading font-semibold text-primary text-center mb-6">
        Sobre a Barbearia Sant's
      </h1>
      <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
        Há mais de uma década oferecendo a melhor experiência em barbearia tradicional,
        unindo técnica clássica e tendências modernas para realçar o melhor de cada cliente.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: <MapPin />, title: "Localização", text: "Rua José Lagrange 34a" },
          { icon: <Clock />, title: "Horário", text: "Seg a Sáb · 09h às 20h" },
          { icon: <Instagram />, title: "Contato", text: "barbeariasants__", link: "https://www.instagram.com/barbeariasants__/" },
          { icon: <Award />, title: "Experiência", text: "+10 anos de tradição" },
        ].map((item) => (
          <div key={item.title} className="p-6 rounded-xl bg-card border border-border flex gap-4">
            <div className="w-12 h-12 rounded-full gold-gradient flex items-center justify-center text-primary-foreground shrink-0">
              {item.icon}
            </div>
            <div>
              <h3 className="font-heading font-semibold text-lg">{item.title}</h3>
              {item.link ? (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground text-sm hover:text-primary hover:underline"
                >
                  {item.text}
                </a>
              ) : (
                <p className="text-muted-foreground text-sm">{item.text}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-heading font-semibold text-primary mb-4 text-center">
          Como chegar
        </h2>
        <div className="rounded-xl overflow-hidden border border-border shadow-lg">
          <iframe
            title="Localização Barbearia Sant's"
            src={`https://www.google.com/maps?q=${encodeURIComponent("Rua José Lagrange 34a")}&output=embed`}
            width="100%"
            height="400"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="border-0 w-full"
          />
        </div>
        <div className="mt-4 text-center">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent("Rua José Lagrange 34a")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 gold-gradient text-primary-foreground font-medium rounded-lg text-sm"
          >
            <MapPin className="w-4 h-4" /> Abrir rota no Google Maps
          </a>
        </div>
      </div>
    </main>
    <Footer />
  </div>
);

export default About;
