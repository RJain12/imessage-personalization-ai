import { StepId } from '@/types/messages';

interface StepperProps {
    currentStep: StepId;
    completedSteps: StepId[];
}

const steps: { id: StepId; label: string }[] = [
    { id: 'export', label: '1. Export' },
    { id: 'upload', label: '2. Upload' },
    { id: 'selectPerson', label: '3. Select' },
    { id: 'process', label: '4. Analyze' },
    { id: 'generate', label: '5. Download' },
];

export default function Stepper({ currentStep, completedSteps }: StepperProps) {
    return (
        <div className="steps">
            {steps.map((step) => (
                <div
                    key={step.id}
                    className={`step ${step.id === currentStep
                            ? 'active'
                            : completedSteps.includes(step.id)
                                ? 'completed'
                                : ''
                        }`}
                >
                    {step.label}
                </div>
            ))}
        </div>
    );
}
