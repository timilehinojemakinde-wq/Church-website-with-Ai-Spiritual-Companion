import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-20 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col items-center text-center">
         <h2 className="font-serif italic text-2xl text-black mb-8">THE AMBASSADORS.</h2>
         
         <div className="flex gap-8 mb-12">
            {['Facebook', 'Instagram', 'YouTube', 'Mixlr'].map((social) => (
               <a key={social} href="#" className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors">
                  {social}
               </a>
            ))}
         </div>

         <p className="text-black-300 text-sm font-light">
            &copy; {new Date().getFullYear()} RCCG THE AMBASSADORS. <br />
            Website Built by HGI Technologies.
         </p>
      </div>
    </footer>
  );
};

export default Footer;