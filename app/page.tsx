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
      <header className="header" style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="float-animation" style={{ width: '40px', height: '40px' }}>
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
              <path d="M21 11.5C21 16.1944 16.9706 20 12 20C10.5186 20 9.12389 19.658 7.89255 19.0526L3 21L4.82143 16.4468C3.6845 15.0863 3 13.3761 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 21 6.80558 21 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1>iMessage Context Builder</h1>
            <p>Reverse-engineered iMessage SQL parsing & Cognitive Profiling</p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <a
              href="https://github.com/RJain12/imessage-personalization-ai"
              target="_blank"
              className="btn btn-sm"
              style={{ fontSize: '0.7rem' }}
            >
              GitHub
            </a>
          </div>
        </div>
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
        marginTop: '8rem',
        padding: '3rem 0',
        borderTop: '1px solid rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h3>Love the project?</h3>
          <p className="opacity-60 text-sm">Help others find it by giving it a star!</p>
          <a
            href="https://github.com/RJain12/imessage-personalization-ai"
            target="_blank"
            className="btn btn-primary"
            style={{ marginTop: '0.5rem' }}
          >
            ⭐ Star on GitHub
          </a>
        </div>

        <p className="opacity-60 text-xs">
          Built by <a href="https://rishabjaink.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }}>Rishab Jain</a> •
          Open Source on <a
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
