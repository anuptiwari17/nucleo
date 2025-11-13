import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

    return (<footer className="relative z-10 border-t-2 border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="group cursor-pointer">
                  <h1 className="text-xl font-black relative transition-all duration-300">
                    <span 
                      className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                      style={{ 
                        fontFamily: '"Orbitron", "Exo 2", "Rajdhani", "Space Grotesk", system-ui, sans-serif',
                        fontWeight: 900,
                        letterSpacing: '0.05em'
                      }}
                    >
                      Nucleo
                    </span>
                  </h1>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Modern employee management platform built for the future of work.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><a href="#features" className="hover:text-slate-900 transition-colors">Features</a></li>
                <li><a href="#showcase" className="hover:text-slate-900 transition-colors">How It Works</a></li>
                <li><a href="#about" className="hover:text-slate-900 transition-colors">About</a></li>
                <li><button onClick={()=>navigate('/pricing')} className="hover:text-slate-900 transition-colors">Pricing</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li><button onClick={() => navigate('/signup')} className="hover:text-slate-900 transition-colors">Get Started</button></li>
                <li><button onClick={() => navigate('/login')} className="hover:text-slate-900 transition-colors">Sign In</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3">Connect</h4>
              <div className="flex space-x-3">
                {['Twitter', 'LinkedIn', 'GitHub'].map((social, i) => (
                  <div key={i} className="w-9 h-9 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg flex items-center justify-center cursor-pointer transition-colors">
                    <span className="text-xs font-bold text-slate-700">{social[0]}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t-2 border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              © 2025 Nucleo. All rights reserved. Built with precision and care.
            </p>
          </div>
        </div>
      </footer>
      );
}

export default Footer;