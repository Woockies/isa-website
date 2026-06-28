import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Check, AlertCircle, Loader } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  age: string;

  // Key questions
  trainingFrequency: string;
  mainBarrier: string;
  previousAttempts: string;
  goal: string;
  timeframe: string;

  // Medical
  medicalFlags: boolean;
  injuries: string;
}

interface Recommendation {
  tier: 'Guided' | 'Intensive';
  realisticAssessment: string;
  topPriorities: string[];
  expectedOutcome: string;
  warningSign: string;
}

export default function AssessmentForm({ onBack }: { onBack?: () => void }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    age: '',
    trainingFrequency: '',
    mainBarrier: '',
    previousAttempts: '',
    goal: '',
    timeframe: '',
    medicalFlags: false,
    injuries: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const totalSteps = 6;

  // Load saved form data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('assessmentData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
  }, []);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateRecommendation = (): Recommendation => {
    const frequency = parseInt(formData.trainingFrequency) || 0;
    const hasInjuries = formData.injuries.length > 10;

    let tier: 'Guided' | 'Intensive' = 'Guided';
    let realisticAssessment = '';
    let topPriorities: string[] = [];
    let expectedOutcome = '';
    let warningSign = '';

    // Scoring logic based on HONESTY
    if (frequency <= 2) {
      tier = 'Intensive';
      realisticAssessment = 'Necesitas alguien monitoreando cada paso. Con 1-2 entrenamientos por semana, cada sesión cuenta.';
      topPriorities = ['Consistencia (tu enemigo #1)', 'Recuperación entre entrenamientos', 'Nutrición sin excusas'];
      expectedOutcome = '8-12 semanas para ver resultados reales. No es rápido, pero es REAL.';
      warningSign = 'Si en 3 semanas no estás en modo "no puedo faltarle", esto no va a funcionar.';
    } else if (frequency === 3) {
      tier = 'Guided';
      realisticAssessment = '3 entrenamientos por semana es el punto dulce. Suficiente consistencia, pero tienes que estar ON.';
      topPriorities = ['Estructura clara en cada sesión', 'Mentalidad: 3 BUENAS vs. 6 mediocres', 'Progresión inteligente'];
      expectedOutcome = '6-8 semanas ves cambios. 3 meses, tienes resultados serios.';
      warningSign = 'Si eliges "descansar" o "estoy muy cansado" más de 1 vez al mes, estás saboteándote.';
    } else {
      tier = 'Guided';
      realisticAssessment = '4+ entrenamientos por semana: Tienes mentalidad de atleta. Ahora necesitas programación inteligente, no solo "ir al gym".';
      topPriorities = ['Evitar overtraining', 'Periodización (picos y valles)', 'Recuperación activa'];
      expectedOutcome = '3-4 semanas ya sientes cambios. 8 semanas, transformación visible.';
      warningSign = 'El enemigo no es el entrenamiento—es la nutrición y el descanso que ignoras.';
    }

    // Adjust by barriers
    if (formData.mainBarrier.toLowerCase().includes('tiempo')) {
      topPriorities.push('⚠️ Tiempo es tu excusa más peligrosa');
    }
    if (formData.mainBarrier.toLowerCase().includes('dolor') || formData.mainBarrier.toLowerCase().includes('lesión')) {
      topPriorities.push('⚠️ Necesitas movimiento adaptado (no reposo total)');
    }
    if (formData.mainBarrier.toLowerCase().includes('motivación')) {
      topPriorities.push('⚠️ Esto no es motivación—es disciplina. Muy diferente.');
    }

    return {
      tier,
      realisticAssessment,
      topPriorities,
      expectedOutcome,
      warningSign,
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const rec = generateRecommendation();
      setRecommendation(rec);

      // Save form data to localStorage for auto-fill
      localStorage.setItem('assessmentData', JSON.stringify(formData));

      // Send to backend (Firebase/fitness-brain-saas)
      const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

      await fetch(`${backendUrl}/api/assessments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          age: parseInt(formData.age) || 0,
          training_frequency: parseInt(formData.trainingFrequency) || 0,
          main_barrier: formData.mainBarrier,
          previous_attempts: formData.previousAttempts,
          goal: formData.goal,
          timeframe: formData.timeframe,
          medical_flags: formData.medicalFlags,
          injuries: formData.injuries,
          recommended_tier: rec.tier,
          tier_reasoning: rec.realisticAssessment,
          top_priorities: rec.topPriorities,
          expected_outcome: rec.expectedOutcome,
          warning_sign: rec.warningSign,
        }),
      }).catch(err => console.error('Backend error:', err));

      // Advance to recommendation screen
      setStep(step + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-black uppercase tracking-tight">
                Seamos <span className="text-isa-canary">Honestos</span>
              </h2>
              <p className="text-sm opacity-70">5 preguntas que separan a quien va a lograrlo de quien solo está tirando dinero.</p>
            </div>

            <div className="space-y-4 pt-6">
              <input
                type="text"
                name="fullName"
                placeholder="Tu nombre"
                autoComplete="name"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className="w-full bg-isa-space/80 border border-isa-alice/50 px-6 py-4 rounded-sm focus:border-isa-canary outline-none placeholder:opacity-70 font-medium"
              />
              <input
                type="email"
                name="email"
                placeholder="Tu email"
                autoComplete="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-isa-space/80 border border-isa-alice/50 px-6 py-4 rounded-sm focus:border-isa-canary outline-none placeholder:opacity-70 font-medium"
              />
              <input
                type="number"
                name="age"
                placeholder="Tu edad"
                autoComplete="bday-year"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className="w-full bg-isa-space/80 border border-isa-alice/50 px-6 py-4 rounded-sm focus:border-isa-canary outline-none placeholder:opacity-70 font-medium"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">La Pregunta Real</h2>
              <p className="text-sm opacity-70 font-medium">¿Cuántas veces a la semana vas a escoger estar incómodo sobre estar cómodo?</p>
            </div>

            <div className="space-y-3">
              {['1 vez', '2 veces', '3 veces', '4+ veces'].map((option) => (
                <label key={option} className="flex items-center gap-3 p-3 border border-isa-alice/30 rounded-sm hover:bg-black/20 cursor-pointer">
                  <input
                    type="radio"
                    name="frequency"
                    value={option.split(' ')[0]}
                    checked={formData.trainingFrequency === option.split(' ')[0]}
                    onChange={(e) => handleInputChange('trainingFrequency', e.target.value)}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm font-medium">{option} por semana</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Sé Honesto</h2>
              <p className="text-sm opacity-70 font-medium">No siempre metas excusas, pero cuando no puedas entrenar usualmente es por...</p>
            </div>

            <textarea
              placeholder="Tiempo, familia, dolor, pereza, trabajo, etc. Lo que SEA, pero honestamente."
              value={formData.mainBarrier}
              onChange={(e) => handleInputChange('mainBarrier', e.target.value)}
              rows={4}
              className="w-full bg-isa-space/80 border border-isa-alice/50 px-6 py-4 rounded-sm focus:border-isa-canary outline-none placeholder:opacity-70 font-medium resize-none"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Tu Historial</h2>
              <p className="text-sm opacity-70 font-medium">¿Has querido o has comenzado a entrenar anteriormente pero...?</p>
            </div>

            <textarea
              placeholder="Qué pasó. Por qué paró. Qué aprendiste (o no aprendiste)."
              value={formData.previousAttempts}
              onChange={(e) => handleInputChange('previousAttempts', e.target.value)}
              rows={4}
              className="w-full bg-isa-space/80 border border-isa-alice/50 px-6 py-4 rounded-sm focus:border-isa-canary outline-none placeholder:opacity-70 font-medium resize-none"
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Tu Meta (Real)</h2>
              <p className="text-sm opacity-70 font-medium">¿Qué esperas lograr y en qué timeframe?</p>
            </div>

            <div className="space-y-4">
              <textarea
                placeholder="Ej: Perder 10 kg, aumentar fuerza, sentirme mejor, verme mejor"
                value={formData.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
                rows={3}
                className="w-full bg-isa-space/80 border border-isa-alice/50 px-6 py-4 rounded-sm focus:border-isa-canary outline-none placeholder:opacity-70 font-medium resize-none"
              />
              <select
                value={formData.timeframe}
                onChange={(e) => handleInputChange('timeframe', e.target.value)}
                className="w-full bg-isa-space/80 border border-isa-alice/50 px-6 py-4 rounded-sm focus:border-isa-canary outline-none font-medium"
              >
                <option value="">¿En cuánto tiempo?</option>
                <option value="4">4 semanas (URGENTE)</option>
                <option value="8">8 semanas (Realista)</option>
                <option value="12">12 semanas (Smart)</option>
                <option value="24">6 meses+ (Long game)</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-2">Última Cosa</h2>
              <p className="text-sm opacity-70 font-medium">¿Hay algo físico que deba saber?</p>
            </div>

            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3 border border-isa-alice/30 rounded-sm hover:bg-black/20 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.medicalFlags}
                  onChange={(e) => handleInputChange('medicalFlags', e.target.checked)}
                  className="mt-1 w-4 h-4 cursor-pointer"
                />
                <span className="text-sm font-medium">Tengo condiciones médicas o dolor crónico que debo mencionar</span>
              </label>

              <textarea
                placeholder="Lesiones, dolor, condiciones, cirugías, medicamentos... Lo que sea."
                value={formData.injuries}
                onChange={(e) => handleInputChange('injuries', e.target.value)}
                rows={3}
                className="w-full bg-isa-space/80 border border-isa-alice/50 px-6 py-4 rounded-sm focus:border-isa-canary outline-none placeholder:opacity-70 font-medium resize-none"
              />
            </div>
          </div>
        );

      case totalSteps:
        return recommendation ? (
          <div className="space-y-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-isa-canary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-isa-canary" size={32} />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tight mb-2">Tu Recomendación</h2>
            </motion.div>

            <div className="space-y-6 bg-black/30 p-6 rounded-lg border border-isa-canary/30">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Programa Recomendado</p>
                <h3 className="text-2xl font-black text-isa-canary">{recommendation.tier} Tier</h3>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Realidad</p>
                <p className="text-sm leading-relaxed font-medium">{recommendation.realisticAssessment}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-3">Tus Prioridades</p>
                <ul className="space-y-2">
                  {recommendation.topPriorities.map((priority, i) => (
                    <li key={i} className="text-sm flex gap-2">
                      <span className="text-isa-canary">→</span>
                      <span>{priority}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-isa-alice/20 pt-4">
                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-2">Expectativa Realista</p>
                <p className="text-sm leading-relaxed font-medium text-isa-canary">{recommendation.expectedOutcome}</p>
              </div>

              <div className="bg-red-950/30 border border-red-900/50 rounded p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-2">⚠️ Tu Mayor Riesgo</p>
                <p className="text-sm text-red-300 font-medium">{recommendation.warningSign}</p>
              </div>
            </div>

            <p className="text-xs opacity-50 text-center font-medium">
              Te contactaremos en 24 horas con los próximos pasos y acceso a tu programa.
            </p>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-isa-space text-isa-alice pt-24 pb-12 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="w-full h-1 bg-isa-alice/20 rounded-full overflow-hidden mb-3">
            <motion.div
              animate={{ width: `${((step + 1) / (totalSteps + 1)) * 100}%` }}
              className="h-full bg-isa-canary"
            />
          </div>
          <p className="text-xs opacity-50 font-bold uppercase tracking-widest">
            {step + 1} of {totalSteps + 1}
          </p>
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {step < totalSteps && (
          <div className="flex gap-4 mt-12">
            <motion.button
              onClick={() => setStep(Math.max(-1, step - 1))}
              disabled={step === 0}
              className={`flex-1 py-4 px-6 font-black uppercase tracking-tight rounded-sm border border-isa-alice/50 ${
                step === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:border-isa-canary'
              }`}
            >
              Atrás
            </motion.button>

            <motion.button
              onClick={() => {
                if (step === totalSteps - 1) {
                  handleSubmit();
                } else {
                  setStep(step + 1);
                }
              }}
              disabled={isSubmitting}
              className="flex-1 bg-isa-canary text-isa-space py-4 px-6 font-black uppercase tracking-tight rounded-sm flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : step === totalSteps - 1 ? (
                <>
                  <Check size={18} />
                  <span>Ver Recomendación</span>
                </>
              ) : (
                <>
                  <span>Siguiente</span>
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>
        )}

        {/* Final CTA */}
        {step === totalSteps && recommendation && (
          <div className="flex gap-4 mt-12">
            <motion.button
              onClick={() => setStep(step - 1)}
              className="flex-1 py-4 px-6 font-black uppercase tracking-tight rounded-sm border border-isa-alice/50 hover:border-isa-canary"
            >
              Atrás
            </motion.button>

            <a
              href="https://www.trainerize.me"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-isa-canary text-isa-space py-4 px-6 font-black uppercase tracking-tight rounded-sm flex items-center justify-center gap-2 hover:bg-isa-canary/90 transition-colors"
            >
              <span>Ir a Trainerize</span>
              <ArrowRight size={18} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
