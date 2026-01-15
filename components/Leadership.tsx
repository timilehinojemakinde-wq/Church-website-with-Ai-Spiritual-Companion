
import React from 'react';

interface Leader {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const leaders: Leader[] = [
  {
    name: "Pastor JOSEPH EBATA",
    role: "Pastor In Charge of Parish",
    image: "/images/pastor.jpg",
    bio: "A visionary leader committed to teaching the undiluted word of God and raising a people of peculiarity and power."
  },
  {
    name: "Pastor (Mrs.) VICTORIA EBATA",
    role: "Wife of PICP",
    image: "/images/mummypastor.jpg", // High quality placeholder since real image is missing
    bio: "A pillar of support and grace, dedicated to the spiritual growth of women and the welfare of the church family."
  },
  {
    name: "Pastor Emmanuel Efuntayo",
    role: "Assistant Parish Pastor",
    image: "/images/asst_pastor.png", // High quality placeholder since real image is missing
    bio: "Dedicated to the service of God and humanity, supporting the vision to raising Kingdom Entrepreneurs."
  }
];

const Leadership: React.FC = () => {
  return (
    <section className="py-32 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        <div className="text-center mb-20 animate-fade-in-up">
           <p className="text-xs font-bold uppercase tracking-[0.2em] text-rccg-blue mb-4">Leadership</p>
           <h2 className="text-4xl md:text-5xl font-serif text-black">Meet Our Shepherds.</h2>
           <div className="w-16 h-1 bg-rccg-gold mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Leaders Grid - 3 Columns */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
           {leaders.map((leader, idx) => (
              <div key={idx} className="group bg-white rounded-[2rem] p-2 shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-rccg-blue/10 transition-all duration-500 hover:-translate-y-2 animate-fade-in-up h-full flex flex-col" style={{ animationDelay: `${idx * 150}ms` }}>
                 
                 {/* Image */}
                 <div className="relative aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-6">
                    <img 
                      src={leader.image} 
                      alt={leader.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                 </div>

                 {/* Content */}
                 <div className="px-4 pb-6 text-center flex-grow flex flex-col">
                    <h3 className="text-2xl font-serif text-gray-900 mb-2 leading-tight group-hover:text-rccg-blue transition-colors">
                       {leader.name}
                    </h3>
                    <p className="text-xs font-bold uppercase tracking-widest text-rccg-red mb-4 border-b border-gray-100 pb-4 mx-auto inline-block">
                       {leader.role}
                    </p>
                    <p className="text-gray-500 text-sm leading-relaxed font-light">
                       {leader.bio}
                    </p>
                 </div>
              </div>
           ))}
        </div>

      </div>
    </section>
  );
};

export default Leadership;
