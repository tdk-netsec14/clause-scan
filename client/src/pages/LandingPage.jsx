import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload, Sparkles, CheckCircle, Play, Star,
  Shield, FileSearch, MessageSquare, ArrowRight,
  Globe, AlertTriangle, FileText, Check
} from 'lucide-react';
import { AnimatedSection, AnimatedCard } from '../components/AnimatedSection';

const LandingPage = () => {
  return (
    <div className="overflow-hidden bg-gray-50">
      {/* ═══ HERO SECTION ═══ */}
      <section className="relative bg-navy-950 min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 bg-dot-grid opacity-30"></div>
        
        {/* Abstract SVG Arcs */}
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <svg viewBox="0 0 400 400" className="absolute top-10 right-10 w-[500px] h-[500px] text-gold-500 fill-current">
            <path d="M400,200 C400,89.543 310.457,0 200,0 L200,40 C288.366,40 360,111.634 360,200 L400,200 Z" />
            <path d="M300,200 C300,144.772 255.228,100 200,100 L200,140 C222.091,140 240,157.909 240,180 L260,180 C260,146.863 233.137,120 200,120 L200,80 C266.274,80 320,133.726 320,200 L300,200 Z" opacity="0.5"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20 w-full flex flex-col lg:flex-row items-center gap-16">
          
          <AnimatedSection className="flex-1 max-w-2xl text-center lg:text-left z-10">
            <div className="inline-block border border-gold-500 rounded-full px-4 py-1.5 mb-8">
              <span className="text-gold-500 text-sm font-medium">🇮🇳 Built for Indian Businesses</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[56px] leading-[1.1] font-bold mb-6 tracking-tight">
              <span className="text-white block mb-2">Justice Shouldn't</span>
              <span className="text-gold-500">Require a Lawyer.</span>
            </h1>

            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
              AI-powered contract analysis in plain English and Hindi.
              Know your risks. Protect your rights. Negotiate with confidence.
            </p>

            <div className="w-12 h-0.5 bg-gold-500 mb-8 mx-auto lg:mx-0"></div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <Link to="/upload" className="w-full sm:w-auto bg-gold-500 hover:bg-gold-400 text-navy-950 px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                Analyze My Contract <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto border border-white hover:bg-white/10 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors">
                <Play className="w-5 h-5" /> Watch How It Works
              </a>
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 fill-gold-500 text-gold-500" />
                ))}
              </div>
              <span className="text-gray-400 text-sm">Trusted by 500+ small business owners</span>
            </div>
          </AnimatedSection>

          <AnimatedSection className="flex-1 w-full max-w-md lg:max-w-none relative z-10">
            {/* Hero Visual Mockup */}
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                <h3 className="font-semibold text-navy-950 font-serif text-xl">Payment Terms</h3>
                <span className="bg-orange-500 text-white text-xs px-3 py-1 rounded-full font-medium">High Risk</span>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 font-mono leading-relaxed">
                    "The Client shall make payment to the Service Provider within ninety (90) days of receipt of a valid invoice..."
                  </p>
                </div>
                <div className="flex items-start gap-3 mt-4">
                  <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-orange-600 font-medium">Risk: Net-90 terms hurt your cash flow.</p>
                </div>
                <div className="flex items-start gap-3 bg-green-50 p-3 rounded-xl border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-green-700 font-medium">Suggested: Change to Net-30 to ensure timely payment.</p>
                </div>
              </div>
            </div>
            
            {/* Decorative element behind card */}
            <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl rounded-full -z-10"></div>
          </AnimatedSection>
          
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <AnimatedSection className="mb-16">
            <span className="text-gold-500 uppercase tracking-wide text-xs font-bold mb-3 block">The Process</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-6">Three steps to contract clarity</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto"></div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '01', icon: Upload, title: 'Upload Your Contract', desc: 'Securely upload your PDF. We support vendor agreements, NDAs, leases, and more.' },
              { num: '02', icon: Sparkles, title: 'AI Analyzes Every Clause', desc: 'Our legal-trained AI scans for red flags, missing protections, and unfair terms in seconds.' },
              { num: '03', icon: CheckCircle, title: 'Understand and Negotiate', desc: 'Get a plain-language summary in English or Hindi, plus a checklist for negotiation.' }
            ].map((step, i) => (
              <AnimatedCard key={step.num} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-left">
                <span className="font-serif text-5xl font-bold text-gold-500 opacity-30 block mb-4">{step.num}</span>
                <step.icon className="w-8 h-8 text-navy-900 mb-6" />
                <h3 className="text-xl font-semibold text-navy-950 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FEATURES BENTO GRID ═══ */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <span className="text-gold-500 uppercase tracking-wide text-xs font-bold mb-3 block">What You Get</span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-6">Everything you need before signing</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto"></div>
          </AnimatedSection>

          <AnimatedSection className="grid md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Large Card */}
            <div className="md:col-span-2 md:row-span-2 bg-navy-900 rounded-3xl p-8 relative overflow-hidden group">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <Shield className="w-10 h-10 text-gold-500 mb-4" />
                  <h3 className="font-serif text-3xl font-bold text-white mb-3">Contract Health Score</h3>
                  <p className="text-gray-300 max-w-md">Get an instant grade (A through F) so you know exactly where you stand before reading a single page.</p>
                </div>
                {/* Visual */}
                <div className="mt-8 flex gap-4">
                  {['A', 'B', 'C', 'D', 'F'].map((grade) => (
                    <div key={grade} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl ${
                      grade === 'C' ? 'bg-amber-500 text-white ring-4 ring-amber-500/30' : 'bg-navy-800 text-gray-500'
                    }`}>
                      {grade}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl group-hover:bg-indigo-600/30 transition-colors"></div>
            </div>

            {/* Medium Card - Hindi Support */}
            <div className="bg-gold-100 rounded-3xl p-8 border-l-4 border-gold-500 flex flex-col justify-center relative overflow-hidden">
              <Globe className="w-8 h-8 text-gold-600 mb-4" />
              <h3 className="font-serif text-xl font-bold text-navy-950 mb-2">Hindi Support</h3>
              <p className="text-gray-700 text-sm">Complex legalese translated into simple Hindi. Understand your obligations completely.</p>
              <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 font-serif text-gold-700">अ</div>
            </div>

            {/* Medium Card - Red Flags */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex flex-col justify-center">
              <AlertTriangle className="w-8 h-8 text-orange-500 mb-4" />
              <h3 className="font-serif text-xl font-bold text-navy-950 mb-2">Red Flags</h3>
              <p className="text-gray-600 text-sm">Instant identification of clauses that severely compromise your business.</p>
            </div>

            {/* Small Cards */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
              <FileText className="w-8 h-8 text-indigo-500 mb-3" />
              <h3 className="font-bold text-navy-950">PDF Reports</h3>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
              <FileSearch className="w-8 h-8 text-indigo-500 mb-3" />
              <h3 className="font-bold text-navy-950">Missing Clauses</h3>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
              <MessageSquare className="w-8 h-8 text-indigo-500 mb-3" />
              <h3 className="font-bold text-navy-950">Q&A Chatbot</h3>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy-900 mb-6">Trusted by Indian businesses</h2>
            <div className="w-16 h-0.5 bg-gold-500 mx-auto"></div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { quote: "The vendor contract had a 90-day payment term hidden on page 6. ClauseScan caught it instantly. I negotiated to 30 days.", name: "Rajesh K.", biz: "Wholesale Distributor" },
              { quote: "I was about to sign a commercial lease that allowed eviction without notice. This tool saved my storefront.", name: "Priya S.", biz: "Boutique Owner" },
              { quote: "Having the contract summarized in Hindi helped me understand the exact liability clauses. Truly empowering.", name: "Amit T.", biz: "Logistics Agency" }
            ].map((t, i) => (
              <AnimatedCard key={i} className="bg-gray-50 rounded-2xl p-8 relative">
                <div className="absolute top-6 left-6 text-6xl text-gold-500/20 font-serif leading-none">"</div>
                <div className="relative z-10 pt-4">
                  <p className="text-gray-700 italic mb-6 leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy-900 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-navy-950 text-sm">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.biz}</p>
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FINAL CTA BANNER ═══ */}
      <section className="bg-navy-900 py-20 border-t-4 border-gold-500">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">Ready to sign that contract?</h2>
            <p className="text-gray-300 text-lg mb-10 max-w-xl mx-auto">
              Analyze it first. It takes 60 seconds and could save your business from a costly mistake.
            </p>
            <Link to="/upload" className="inline-flex bg-gold-500 hover:bg-gold-400 text-navy-950 px-8 py-4 rounded-xl font-semibold items-center justify-center gap-2 transition-colors">
              Analyze Contract Now <ArrowRight className="w-5 h-5" />
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-navy-950 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-gold-500" />
            <span className="font-serif text-xl font-bold text-white">ClauseScan</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 ClauseScan. All rights reserved. Not a law firm.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
