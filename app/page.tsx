'use client';

import { useState } from 'react';
import { StepState, StepId } from '@/types/messages';
import Stepper from './components/Stepper';
import Step1Export from './components/Step1Export';
import Step2Upload from './components/Step2Upload';
import Step2_5SelectPerson from './components/Step2_5SelectPerson';
import Step3Process from './components/Step3Process';
import Step4Generate from './components/Step4Generate';
import Step5Intelligence from './components/Step5Intelligence';

export default function Home() {
  const [state, setState] = useState<StepState>({
    currentStep: 'export',
    completedSteps: [],
    parsedData: null,
    selectedName: null,
    analysisResult: null,
    generatedContext: null,
    error: null,
    isProcessing: false,
  });

  const handleStepComplete = (step: StepId, data?: any) => {
    setState(prev => ({
      ...prev,
      completedSteps: [...prev.completedSteps, step],
      currentStep: getNextStep(step),
      ...(data && { [getDataKey(step)]: data }),
    }));
  };

  const handleBack = (step: StepId) => {
    setState(prev => ({
      ...prev,
      currentStep: step,
    }));
  };

  const handleStartOver = () => {
    setState({
      currentStep: 'export',
      completedSteps: [],
      parsedData: null,
      selectedName: null,
      analysisResult: null,
      generatedContext: null,
      error: null,
      isProcessing: false,
    });
  };

  return (
    <div className="container" style={{ paddingBottom: '5rem' }}>
      <header className="header">
        <h1>iMessage Context Builder</h1>
        <p>Transform your iMessage history into a personalized AI profile</p>
      </header>

      <Stepper currentStep={state.currentStep} completedSteps={state.completedSteps} />

      <main className="fade-in" style={{ minHeight: '600px' }}>
        {state.currentStep === 'export' && (
          <Step1Export onComplete={() => handleStepComplete('export')} />
        )}

        {state.currentStep === 'upload' && (
          <Step2Upload
            onComplete={(data) => handleStepComplete('upload', data)}
            onBack={() => handleBack('export')}
          />
        )}

        {state.currentStep === 'selectPerson' && state.parsedData && (
          <Step2_5SelectPerson
            parsedData={state.parsedData}
            onComplete={(name) => handleStepComplete('selectPerson', name)}
            onBack={() => handleBack('upload')}
          />
        )}

        {state.currentStep === 'process' && state.parsedData && state.selectedName && (
          <Step3Process
            parsedData={state.parsedData}
            selectedName={state.selectedName}
            onComplete={(analysis) => handleStepComplete('process', analysis)}
            onBack={() => handleBack('selectPerson')}
          />
        )}

        {state.currentStep === 'generate' && state.analysisResult && (
          <Step4Generate
            analysisResult={state.analysisResult}
            onComplete={() => handleStepComplete('generate')}
            onBack={() => handleBack('process')}
          />
        )}

        {state.currentStep === 'intelligence' && state.analysisResult && (
          <Step5Intelligence
            analysisResult={state.analysisResult}
            onBack={() => handleBack('generate')}
            onStartOver={handleStartOver}
          />
        )}
      </main>

      <footer style={{
        marginTop: '5rem',
        padding: '2rem 0',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        textAlign: 'center',
        fontSize: '0.8rem',
        opacity: 0.6
      }}>
        <p>
          Built by <a href="https://rishabjaink.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Rishab Jain</a> •
          View on <a
            href="https://github.com/RJain12/imessage-personalization-ai.git"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'underline' }}
          >GitHub</a>
        </p>
      </footer>
    </div>
  );
}

function getNextStep(current: StepId): StepId {
  const steps: StepId[] = ['export', 'upload', 'selectPerson', 'process', 'generate', 'intelligence'];
  const currentIndex = steps.indexOf(current);
  return steps[currentIndex + 1] || current;
}

function getDataKey(step: StepId): string {
  const map: Record<StepId, string> = {
    export: '',
    upload: 'parsedData',
    selectPerson: 'selectedName',
    process: 'analysisResult',
    generate: '',
    intelligence: '',
  };
  return map[step];
}
