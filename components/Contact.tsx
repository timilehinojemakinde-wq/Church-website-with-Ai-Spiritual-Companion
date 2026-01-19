import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-0 bg-white">
       <div className="w-full h-[500px] relative grayscale hover:grayscale-0 transition-all duration-1000">
          <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.686406478895!2d3.6196543147696584!3d6.434315995344741!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf90000000001%3A0x123456789abcdef!2sAbijo%20GRA!5e0!3m2!1sen!2sng!4v1625000000000!5m2!1sen!2sng" 
             width="100%" 
             height="100%" 
             style={{ border: 0 }} 
             allowFullScreen 
             loading="lazy"
             className="bg-gray-100"
          ></iframe>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-10 md:p-16 shadow-2xl max-w-md w-[90%] text-center">
             <h3 className="font-serif text-3xl text-black mb-2">Visit Us</h3>
             <div className="w-10 h-px bg-rccg-gold mx-auto mb-6"></div>
             <p className="text-gray-500 font-light leading-relaxed mb-8">
                The Ambassadors<br />
                Plot 3010, Leijja Close, Beechwood Estate<br />
                Imalete Ibeju-Lekki-Epe Expy, Lagos.
             </p>
             <a href="mailto:hello@rccgtheambassadors.org" className="text-sm font-bold uppercase tracking-widest text-black border-b border-gray-200 hover:border-black pb-1 transition-all">
                Get Directions
             </a>
          </div>
       </div>
    </section>
  );
};

export default Contact;