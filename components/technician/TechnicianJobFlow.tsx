import React, { useState } from 'react';
import { Job, JobStatus, InventoryItem, ChemicalUsage } from '../../types';
import JobSummary from './JobSummary';
import CustomerInfo from './CustomerInfo';
import InteractiveJobSheet from './InteractiveJobSheet';

type JobFlowStep = 'SUMMARY' | 'CUSTOMER_INFO' | 'JOB_SHEET';

interface TechnicianJobFlowProps {
    job: Job;
    onExit: () => void;
    onUpdateJob: (updatedJob: Job) => void;
    onUpdateJobStatus: (jobId: string, newStatus: JobStatus) => void;
    onUpdateInventory: (itemId: string, amountUsed: number) => void;
}

const TechnicianJobFlow: React.FC<TechnicianJobFlowProps> = (props) => {
    const [currentStep, setCurrentStep] = useState<JobFlowStep>('SUMMARY');

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 'SUMMARY':
                return <JobSummary job={props.job} onNext={() => setCurrentStep('CUSTOMER_INFO')} onExit={props.onExit} />;
            case 'CUSTOMER_INFO':
                return <CustomerInfo job={props.job} onNext={() => setCurrentStep('JOB_SHEET')} onBack={() => setCurrentStep('SUMMARY')} />;
            case 'JOB_SHEET':
                return <InteractiveJobSheet {...props} />;
            default:
                return <div>Invalid Step</div>;
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            {renderCurrentStep()}
        </div>
    );
};

export default TechnicianJobFlow;
