
import React from 'react';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

const events = [
  {
    day: "05",
    month: "FEB",
    title: "EVERY TONGUE AND TRIBE",
    time: "9:00 AM",
    desc: "A special service of gratitude with high praise and worship.",
    location: "Main Auditorium"
  },
  {
    day: "10",
    month: "FEB",
    title: "Night of Glory",
    time: "10:00 PM",
    desc: "Monthly vigil for spiritual warfare and breakthrough prayers.",
    location: "Main Auditorium"
  },
  {
    day: "19",
    month: "FEB",
    title: "Youth Summit",
    time: "12:00 PM",
    desc: "Empowering the next generation for kingdom impact.",
    location: "Youth Hall"
  }
];

const Events: React.FC = () => {
  return (
    <section id="events" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
           <div className="animate-fade-in-up">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-rccg-blue mb-4">Calendar</p>
              <h2 className="text-4xl md:text-5xl font-serif text-black">Upcoming Events</h2>
           </div>
           <a href="#" className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors mt-4 md:mt-0">
              View Full Calendar <ArrowRight size={14} />
           </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {events.map((event, i) => (
             <div key={i} className="group bg-gray-50 p-8 rounded-[2rem] border border-gray-100 hover:border-rccg-gold/30 hover:shadow-xl transition-all duration-300 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex justify-between items-start mb-8">
                   <div className="flex flex-col items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:bg-rccg-blue group-hover:text-white transition-colors duration-300">
                      <span className="text-xs font-bold uppercase tracking-widest opacity-60">{event.month}</span>
                      <span className="text-2xl font-black">{event.day}</span>
                   </div>
                   <div className="px-3 py-1 rounded-full bg-white border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Upcoming
                   </div>
                </div>
                
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3 group-hover:text-rccg-blue transition-colors">{event.title}</h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{event.desc}</p>
                
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-400">
                   <div className="flex items-center gap-1">
                      <Clock size={14} /> {event.time}
                   </div>
                   <div className="flex items-center gap-1">
                      <MapPin size={14} /> {event.location}
                   </div>
                </div>
             </div>
          ))}
        </div>
        
        <div className="mt-12 md:hidden">
            <a href="#" className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 border border-gray-200 rounded-full py-4">
              View Full Calendar <ArrowRight size={14} />
           </a>
        </div>

      </div>
    </section>
  );
};

export default Events;
