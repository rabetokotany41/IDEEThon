import React, { useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/forms/Select';

interface Symptome {
  id: string;
  question: string;
  options: { value: string; label: string; next?: string }[];
}

const diagnosticData: { [key: string]: Symptome } = {
  start: {
    id: 'start',
    question: 'Quelle partie de la plante est affectée ?',
    options: [
      { value: 'feuilles', label: 'Feuilles', next: 'feuilles' },
      { value: 'fruits', label: 'Fruits', next: 'fruits' },
      { value: 'tronc', label: 'Tronc / Tiges', next: 'tronc' },
      { value: 'racines', label: 'Racines', next: 'racines' },
    ],
  },
  feuilles: {
    id: 'feuilles',
    question: 'Que constatez-vous sur les feuilles ?',
    options: [
      { value: 'jaunissement', label: 'Jaunissement', next: 'feuilles_jaunissement' },
      { value: 'taches', label: 'Taches', next: 'feuilles_taches' },
      { value: 'roulissement', label: 'Enroulement', next: 'feuilles_roulissement' },
      { value: 'chute', label: 'Chute prématurée', next: 'feuilles_chute' },
    ],
  },
  feuilles_jaunissement: {
    id: 'feuilles_jaunissement',
    question: 'Le jaunissement commence par où ?',
    options: [
      { value: 'bord', label: 'Bord des feuilles', result: 'carence_azote' },
      { value: 'entre_nervures', label: 'Entre les nervures', result: 'carence_magnesium' },
      { value: 'general', label: 'Toute la feuille', result: 'stress_hydrique' },
    ],
  },
  feuilles_taches: {
    id: 'feuilles_taches',
    question: 'Quel type de taches ?',
    options: [
      { value: 'brunes', label: 'Taches brunes', result: 'mildiou' },
      { value: 'jaunes', label: 'Taches jaunes', result: 'mosaique' },
      { value: 'noires', label: 'Taches noires', result: 'alternariose' },
    ],
  },
  fruits: {
    id: 'fruits',
    question: 'Que constatez-vous sur les fruits ?',
    options: [
      { value: 'pourriture', label: 'Pourriture', result: 'pourriture_grise' },
      { value: 'taches', label: 'Taches', result: 'taches_bacteriennes' },
      { value: 'deformation', label: 'Déformation', result: 'virus_mosaïque' },
    ],
  },
  tronc: {
    id: 'tronc',
    question: 'Que constatez-vous sur le tronc ou les tiges ?',
    options: [
      { value: 'chancre', label: 'Chancre (lésions)', result: 'chancre' },
      { value: 'pourriture', label: 'Pourriture', result: 'pourriture_coleoptile' },
      { value: 'couleur', label: 'Changement de couleur', result: 'deficience' },
    ],
  },
  racines: {
    id: 'racines',
    question: 'Que constatez-vous sur les racines ?',
    options: [
      { value: 'pourriture', label: 'Pourriture', result: 'pourriture_racines' },
      { value: 'nodules', label: 'Nodules', result: 'nematodes' },
      { value: 'seches', label: 'Sèches', result: 'secheresse' },
    ],
  },
};

const solutions: { [key: string]: { maladie: string; description: string; traitement: string; prevention: string } } = {
  carence_azote: {
    maladie: 'Carence en azote',
    description: 'Les feuilles jaunissent en commençant par les bords. La plante manque d\'azote pour sa croissance.',
    traitement: 'Apport d\'engrais riche en azote (urée, nitrate d\'ammonium). Dose: 50-100 kg/ha selon la culture.',
    prevention: 'Faites une analyse de sol avant la plantation. Alternez les cultures avec des légumineuses.',
  },
  carence_magnesium: {
    maladie: 'Carence en magnésium',
    description: 'Jaunissement entre les nervures des feuilles anciennes.',
    traitement: 'Apport de sulfate de magnésium ou de dolomie. Épandage: 100-200 kg/ha.',
    prevention: 'Maintenez un pH du sol entre 6 et 7. Évitez l\'excès de potassium.',
  },
  stress_hydrique: {
    maladie: 'Stress hydrique',
    description: 'Jaunissement général dû au manque ou excès d\'eau.',
    traitement: 'Ajustez l\'irrigation. En cas de sécheresse: arrosage régulier. En cas d\'excès: drainage du sol.',
    prevention: 'Utilisez le paillage pour conserver l\'humidité. Installez un système de drainage.',
  },
  mildiou: {
    maladie: 'Mildiou',
    description: 'Taches brunes huileuses sur les feuilles, duvet blanc au revers.',
    traitement: 'Fongicide à base de cuivre ou mancozèbe. Traitez dès les premiers symptômes.',
    prevention: 'Évitez l\'excès d\'humidité. Espacez les plants pour une meilleure aération.',
  },
  mosaique: {
    maladie: 'Mosaïque virale',
    description: 'Motifs en mosaïque jaune-vert sur les feuilles.',
    traitement: 'Aucun traitement curatif. Éliminez les plants infectés.',
    prevention: 'Utilisez des semences certifiées. Luttez contre les insectes vecteurs (pucerons).',
  },
  pourriture_grise: {
    maladie: 'Pourriture grise (Botrytis)',
    description: 'Pourriture molle des fruits avec duvet gris.',
    traitement: 'Fongicide spécifique botryticide. Retirez les fruits infectés.',
    prevention: 'Aérez bien les cultures. Évitez l\'excès d\'humidité et les blessures aux fruits.',
  },
};

export const DiagnosticPlantes: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [diagnostic, setDiagnostic] = useState<typeof solutions[keyof typeof solutions] | null>(null);

  const handleAnswer = (value: string, next?: string, result?: string) => {
    setHistory([...history, value]);
    
    if (result) {
      setDiagnostic(solutions[result]);
    } else if (next) {
      setCurrentStep(next);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      
      if (newHistory.length === 0) {
        setCurrentStep('start');
        setDiagnostic(null);
      } else {
        // Find the previous step
        const previousAnswer = newHistory[newHistory.length - 1];
        // This is simplified - in a real app, you'd track the full path
        setCurrentStep('start');
        setDiagnostic(null);
      }
    }
  };

  const handleReset = () => {
    setCurrentStep('start');
    setHistory([]);
    setDiagnostic(null);
  };

  const currentQuestion = diagnosticData[currentStep];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold text-gray-900">Diagnostic des plantes</h1>
          <p className="text-gray-600">Identifiez les maladies de vos cultures</p>
        </CardHeader>
        <CardBody>
          {!diagnostic ? (
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span className="font-medium">Progression:</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-2 bg-primary-500 rounded-full transition-all"
                      style={{ width: `${(history.length / 3) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {currentQuestion.question}
                </h2>
              </div>

              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    fullWidth
                    onClick={() => handleAnswer(option.value, option.next, option.result)}
                    className="text-left justify-start h-auto py-3"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>

              {history.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="mt-4"
                >
                  ← Retour
                </Button>
              )}
            </div>
          ) : (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  🌿 {diagnostic.maladie}
                </h3>
                <p className="text-green-700">{diagnostic.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">💊 Traitement</h4>
                  <p className="text-gray-600">{diagnostic.traitement}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">🛡️ Prévention</h4>
                  <p className="text-gray-600">{diagnostic.prevention}</p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Ce diagnostic est basé sur vos réponses. Pour un diagnostic précis,
                  consultez un agent agricole ou envoyez une photo à un expert.
                </p>
              </div>
            </div>
          )}
        </CardBody>
        {diagnostic && (
          <CardFooter>
            <Button onClick={handleReset} fullWidth>
              Nouveau diagnostic
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
