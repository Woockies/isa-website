import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Zap, Settings } from 'lucide-react';
import AssessmentForm from './components/AssessmentForm';

export default function App() {
  const [showAssessment, setShowAssessment] = useState(false);

  if (showAssessment) {
    return <AssessmentForm onBack={() => setShowAssessment(false)} />;
  }

  return (
    <div className="min-h-screen bg-isa-space text-isa-alice font-sans">
      {/* TOP BAR - MINIMAL */}
      <nav className="fixed top-0 w-full z-50 px-6 md:px-8 py-4 border-b border-isa-alice/10 backdrop-blur-sm bg-isa-space/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-xs font-black tracking-[0.3em] uppercase">ISA</div>
        </div>
      </nav>

      {/* HERO - CLEAR PROMISE */}
      <section className="pt-24 md:pt-32 pb-12 md:pb-20 px-6 md:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight">
              Elige Tu
              <br />
              <span className="text-isa-canary">Coaching</span>
            </h1>
            <p className="text-base md:text-lg opacity-70 font-medium max-w-2xl mx-auto leading-relaxed">
              Responde un rápido cuestionario y recibe recomendaciones personalizadas + acceso a tu programa.
            </p>
          </motion.div>
        </div>
      </section>

      {/* OPTIONS - INFO ONLY (NO BUTTONS) */}
      <section className="pb-16 md:pb-24 px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* OPTION 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              className="p-6 md:p-8 border-2 border-isa-alice/30 rounded-lg hover:border-isa-alice/60 transition-colors bg-black/20"
            >
              <div className="space-y-6">
                <div>
                  <div className="w-10 h-10 bg-isa-canary/10 rounded-lg flex items-center justify-center text-isa-canary mb-4">
                    <Zap size={20} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Elite Coaching</h3>
                </div>

                <div className="space-y-2">
                  <p className="text-sm opacity-70 font-medium">$150/mes</p>
                  <p className="text-sm leading-relaxed opacity-80">
                    Acompañamiento total con check-ins semanales, análisis personalizado y acceso a tu programa adaptado.
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-isa-alice/10">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50">Incluye:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2 text-sm">
                      <span className="text-isa-canary font-bold">✓</span>
                      <span>Check-in semanal</span>
                    </li>
                    <li className="flex gap-2 text-sm">
                      <span className="text-isa-canary font-bold">✓</span>
                      <span>Ajustes personalizados</span>
                    </li>
                    <li className="flex gap-2 text-sm">
                      <span className="text-isa-canary font-bold">✓</span>
                      <span>Soporte por email</span>
                    </li>
                    <li className="flex gap-2 text-sm">
                      <span className="text-isa-canary font-bold">✓</span>
                      <span>Seguimiento de progreso</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* OPTION 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="p-6 md:p-8 border-2 border-isa-alice/30 rounded-lg hover:border-isa-alice/60 transition-colors bg-black/20"
            >
              <div className="space-y-6">
                <div>
                  <div className="w-10 h-10 bg-isa-canary/10 rounded-lg flex items-center justify-center text-isa-canary mb-4">
                    <Settings size={20} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">Custom Protocol</h3>
                </div>

                <div className="space-y-2">
                  <p className="text-sm opacity-70 font-medium">Desde $120/mes</p>
                  <p className="text-sm leading-relaxed opacity-80">
                    Rutina maestra personalizada para tu equipo y nivel. Acceso a app + contenido actualizado.
                  </p>
                </div>

                <div className="space-y-2 pt-4 border-t border-isa-alice/10">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-50">Incluye:</p>
                  <ul className="space-y-2">
                    <li className="flex gap-2 text-sm">
                      <span className="text-isa-canary font-bold">✓</span>
                      <span>Programa personalizado</span>
                    </li>
                    <li className="flex gap-2 text-sm">
                      <span className="text-isa-canary font-bold">✓</span>
                      <span>Acceso a app</span>
                    </li>
                    <li className="flex gap-2 text-sm">
                      <span className="text-isa-canary font-bold">✓</span>
                      <span>Contenido actualizado</span>
                    </li>
                    <li className="flex gap-2 text-sm">
                      <span className="text-isa-canary font-bold">✓</span>
                      <span>Libertad total</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SINGLE CTA - CENTERED */}
      <section className="py-8 md:py-16 px-6 md:px-8 bg-black/30">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => setShowAssessment(true)}
              className="w-full md:w-auto bg-isa-canary text-isa-space px-8 md:px-12 py-4 md:py-5 font-black uppercase tracking-tight rounded-lg text-base md:text-lg flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-isa-canary/50 transition-all active:scale-95"
            >
              <span>Comenzar Evaluación</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
          <p className="text-xs md:text-sm opacity-50 font-medium">
            Toma 10 minutos. Sin compromiso.
          </p>
        </div>
      </section>

      {/* FOOTER - MINIMAL */}
      <footer className="border-t border-isa-alice/10 py-8 md:py-12 px-6 md:px-8 mt-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs opacity-40 font-bold uppercase tracking-widest">
            <div>Andrés Sotomayor | ISA</div>
            <div className="text-center md:text-right space-y-1">
              <p>San Juan, Puerto Rico</p>
              <p>info@andressotomayor.com</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
