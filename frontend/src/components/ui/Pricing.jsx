import { Link, useNavigate } from 'react-router-dom';


const Check = () => (
  <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'For individuals getting started',
    features: ['3 active members', 'Basic assignments', '3 active tasks', 'Basic analytics'],
    cta: 'Start Free',
    variant: 'outline',
  },
  {
    name: 'Pro',
    price: '$8',
    per: '/user/mo',
    description: 'For growing teams that ship fast',
    features: [
      'Unlimited tasks & history',
      'Dependencies & subtasks',
      'Advanced analytics',
      'Custom fields + templates',
      'Priority support',
      'Guest access',
    ],
    cta: 'Start Free Trial',
    variant: 'filled',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For organizations at scale',
    features: [
      'Everything in Pro',
      'SSO & advanced roles',
      'Audit logs',
      'Dedicated support',
      '99.99% uptime SLA',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    variant: 'dark',
  },
];

const PricingCard = ({ plan }) => {
  const isPopular = plan.popular;

  return (
    <div
      className={`relative group transition-all duration-500 hover:-translate-y-3 ${
        isPopular ? 'z-10' : ''
      }`}
    >
      {isPopular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            MOST POPULAR
          </span>
        </div>
      )}

      <div
        className={`h-full bg-white rounded-2xl p-8 border-2 transition-all duration-500 ${
          isPopular
            ? 'border-violet-500 shadow-xl shadow-violet-500/10'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="text-center">
          <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
          <div className="mt-5">
            <span className="text-5xl font-black text-slate-900">{plan.price}</span>
            {plan.per && <span className="text-lg text-slate-500 font-medium">{plan.per}</span>}
          </div>
          <p className="mt-3 text-slate-600 text-sm">{plan.description}</p>
        </div>

        <ul className="mt-10 space-y-4">
          {plan.features.map((feature, i) => (
            <li key={i} className="flex items-center text-sm">
              <Check />
              <span className="ml-3 text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10">
          <Link
            to={plan.variant === 'dark' ? '/contact' : '/signup'}
            className={`w-full block text-center py-3.5 rounded-xl font-semibold transition-all duration-300 ${
              plan.variant === 'filled'
                ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
                : plan.variant === 'dark'
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'border-2 border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-50'
            }`}
          >
            {plan.cta}
          </Link>
        </div>
      </div>
    </div>
  );
};

const Pricing = () => {
    const navigate = useNavigate();
  return (
    <>

    <nav className="relative z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200 sticky top-0">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="group cursor-pointer">
                <h1 className="text-2xl font-black relative transition-all duration-300 group-hover:scale-105">
                  <span 
                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-blue-600 bg-clip-text text-transparent"
                    style={{ 
                      fontFamily: '"Orbitron", "Exo 2", "Rajdhani", "Space Grotesk", system-ui, sans-serif',
                      fontWeight: 900,
                      letterSpacing: '0.05em'
                    }}
                    onClick={() => navigate('/')}
                  >
                    Nucleo
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-400/20 via-purple-400/20 to-blue-400/20 
                              rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </h1>
              </div>
            </div>
            
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Sign in
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="pt-24 pb-32 bg-gradient-to-b from-white to-slate-50/50">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
            Pricing that <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">makes sense</span>
          </h1>
          <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
            Start free. Scale smoothly. Pay only for what you need.
          </p>
        </div>
      </section>

      {/* Pricing Cards – Tighter, Cleaner, More Premium */}
      <section className="-mt-20 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <PricingCard key={i} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Footer */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-slate-600">
            <span className="flex items-center gap-2"><Check /> 14-day free trial</span>
            <span className="flex items-center gap-2"><Check /> No credit card required</span>
            <span className="flex items-center gap-2"><Check /> Cancel anytime</span>
            <span className="flex items-center gap-2"><Check /> 24/7 support</span>
          </div>
          <p className="mt-8 text-sm text-slate-500">
            Join 10,000+ teams already using Nucleo to ship faster
          </p>
        </div>
      </section>
    </>
  );
};

export default Pricing;