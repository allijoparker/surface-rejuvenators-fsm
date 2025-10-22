
import React, { useState, useCallback, useEffect } from 'react';
import { Job, JobStatus, ChemicalUsage, AIJobPlan, AIJobPlanStep, InventoryItem, Service } from '../../types';
import { ChevronLeft, Camera, NotebookText, CreditCard, Banknote, Check, AlertTriangle, BrainCircuit } from 'lucide-react';
import { generateJobPlan } from '../../services/geminiService';
import { INITIAL_INVENTORY, SERVICES, FORMULA_INGREDIENTS } from '../../constants';

interface InteractiveJobSheetProps {
    job: Job;
    onExit: () => void;
    onUpdateJob: (updatedJob: Job) => void;
    onUpdateJobStatus: (jobId: string, newStatus: JobStatus) => void;
    onUpdateInventory: (itemId: string, amountUsed: number) => void;
}

const InteractiveJobSheet: React.FC<InteractiveJobSheetProps> = ({ job, onExit, onUpdateJob, onUpdateJobStatus, onUpdateInventory }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState<string | null>(null);
    const [aiPlan, setAiPlan] = useState<AIJobPlan | null>(job.jobSheet.aiJobPlan || null);

    const handleGeneratePlan = useCallback(async () => {
        if (aiPlan) return;
        setIsGenerating(true);
        setGenerationError(null);
        
        const requiredChemicalIds = new Set<string>();
        job.services.forEach(quoteItem => {
            const fullService = SERVICES.find(s => s.id === quoteItem.service.id);
            if (!fullService) return;

            const tierFormulas = new Set<string>();
            quoteItem.tiers.forEach(tier => {
                (tier.includes || fullService.includes || []).forEach(f => tierFormulas.add(f))
            });

            tierFormulas.forEach(formula => {
                FORMULA_INGREDIENTS[formula]?.forEach(id => requiredChemicalIds.add(id));
            });

            quoteItem.addOns.forEach(addOn => {
                 const addonFormulaName = addOn.name;
                 FORMULA_INGREDIENTS[addonFormulaName]?.forEach(id => requiredChemicalIds.add(id));
            });
        });

        const requiredIngredients = INITIAL_INVENTORY.filter(
            item => item.category === 'chemical' && requiredChemicalIds.has(item.id)
        );

        // Create a representation of the services for the AI
        const servicesForPlan: Service[] = job.services.map((q): Service | null => {
            const service = SERVICES.find(s => s.id === q.service.id);
            if (!service) return null;
            // Create a temporary service object that includes the chosen tier and addons for a more specific plan
            return {
                ...service,
                name: `${service.name} (${q.tiers.map(t => t.name).join('/')} Tier)`,
                addOns: q.addOns
            };
        }).filter((s): s is Service => s !== null);


        const plan = await generateJobPlan(servicesForPlan, requiredIngredients);
        
        if (plan) {
            setAiPlan(plan);
            onUpdateJob({ ...job, jobSheet: { ...job.jobSheet, aiJobPlan: plan } });
        } else {
             setGenerationError('Failed to generate a job plan. The AI model may be temporarily unavailable or there was an issue with the request. Please try again later.');
        }
        setIsGenerating(false);
    }, [job, onUpdateJob, aiPlan]);

    useEffect(() => {
        if (!aiPlan && !isGenerating) {
            handleGeneratePlan();
        }
    }, [aiPlan, isGenerating, handleGeneratePlan]);
    
    const handleStepToggle = (stepIndex: number) => {
        if (!aiPlan) return;
        const newSteps = [...aiPlan.steps];
        newSteps[stepIndex].completed = !newSteps[stepIndex].completed;
        const updatedPlan = { ...aiPlan, steps: newSteps };
        setAiPlan(updatedPlan);
        onUpdateJob({ ...job, jobSheet: { ...job.jobSheet, aiJobPlan: updatedPlan } });
    };

    const handleChemicalUsageChange = (stepIndex: number, ingredientId: string, amount: string) => {
        if (!aiPlan) return;
        const newSteps = [...aiPlan.steps];
        const step = newSteps[stepIndex];
        
        if (!step.ingredientUsage) {
            step.ingredientUsage = {};
        }
        
        step.ingredientUsage[ingredientId] = parseFloat(amount) || 0;
    
        const updatedPlan = { ...aiPlan, steps: newSteps };
        setAiPlan(updatedPlan);
        onUpdateJob({ ...job, jobSheet: { ...job.jobSheet, aiJobPlan: updatedPlan } });
    };

    const handleMarkJobComplete = (paymentMethod: string) => {
        const chemicalUsageMap = new Map<string, number>();
        aiPlan?.steps.forEach(step => {
            if (step.type === 'chemical_mix' && step.ingredientUsage) {
                for (const ingredientId in step.ingredientUsage) {
                    const amountUsed = step.ingredientUsage[ingredientId];
                    if (amountUsed > 0) {
                        const currentAmount = chemicalUsageMap.get(ingredientId) || 0;
                        chemicalUsageMap.set(ingredientId, currentAmount + amountUsed);
                    }
                }
            }
        });

        const finalChemicalUsage: ChemicalUsage[] = [];
        chemicalUsageMap.forEach((amount, id) => {
            onUpdateInventory(id, amount);
            const inventoryItem = INITIAL_INVENTORY.find(i => i.id === id);
            if (inventoryItem) {
                 finalChemicalUsage.push({
                    itemId: id,
                    itemName: inventoryItem.name,
                    amountUsed: amount
                });
            }
        });
        
        const updatedJob = {...job, jobSheet: {...job.jobSheet, chemicalUsage: finalChemicalUsage}};
        onUpdateJob(updatedJob);

        alert(`Payment received via ${paymentMethod}. An email receipt will be sent to ${job.customer.email}.`);
        onUpdateJobStatus(job.id, JobStatus.COMPLETED);
        onExit();
    };

    const handleMarkDelayed = () => {
        const reason = prompt("Please enter the reason for the delay/incompletion:");
        if (reason) {
            const updatedJob = {
                ...job,
                jobSheet: { ...job.jobSheet, notes: `${job.jobSheet.notes || ''}\n\nDELAYED: ${reason}` }
            };
            onUpdateJob(updatedJob);
            onUpdateJobStatus(job.id, JobStatus.DELAYED);
            onExit();
        }
    }


    const renderPlan = () => {
        if (isGenerating) {
            return (
              <div className="text-center p-6 bg-white rounded-lg shadow flex flex-col items-center gap-3">
                <BrainCircuit className="h-10 w-10 text-brand-primary animate-pulse" />
                <p className="font-semibold text-gray-600">Generating AI Job Plan...</p>
                <p className="text-sm text-gray-500">This may take a moment.</p>
              </div>
            );
        }
        if (generationError) {
            return (
                <div className="text-center p-6 bg-red-50 text-red-700 rounded-lg shadow border border-red-200">
                    <div className="flex items-center justify-center gap-3">
                        <AlertTriangle className="h-8 w-8" />
                        <h3 className="font-bold text-lg">Error Generating Job Plan</h3>
                    </div>
                    <p className="mt-2 text-sm">{generationError}</p>
                </div>
            );
        }
        if (!aiPlan) {
            return null; // Should be covered by the loading state, but here for safety.
        }
        
        return (
            <div className="space-y-3">
            {aiPlan.steps.map((step, index) => (
                <div key={index} className={`p-4 rounded-lg transition-all ${step.completed ? 'bg-green-50 border-l-4 border-green-400' : 'bg-white shadow-sm'}`}>
                    <div className="flex items-start">
                        <input
                            type="checkbox"
                            checked={step.completed}
                            onChange={() => handleStepToggle(index)}
                            className="h-6 w-6 rounded text-brand-primary focus:ring-brand-primary mt-1 cursor-pointer"
                        />
                        <div className="ml-4 flex-1">
                            <h4 className={`font-bold text-gray-800 ${step.completed ? 'line-through text-gray-500' : ''}`}>{step.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{step.details}</p>
                            {step.type === 'chemical_mix' && (
                                <div className="mt-3 p-3 bg-blue-50 rounded-md border border-blue-200">
                                    <p className="text-sm text-blue-800 font-semibold">Mixing Instructions:</p>
                                    <p className="text-sm text-blue-900 mb-3">{step.mixRatio}</p>
                                    
                                    <h5 className="text-sm font-semibold text-gray-700 mb-2 pt-2 border-t border-blue-200">Record Actual Amounts Used:</h5>
                                    <div className="space-y-2">
                                        {step.ingredients?.map(ingredient => (
                                            <div key={ingredient.id} className="flex items-center gap-2">
                                                <label htmlFor={`chem-usage-${index}-${ingredient.id}`} className="text-sm font-medium text-gray-700 flex-1 truncate">{ingredient.name}:</label>
                                                <input
                                                    id={`chem-usage-${index}-${ingredient.id}`}
                                                    type="number"
                                                    step="0.1"
                                                    value={step.ingredientUsage?.[ingredient.id] || ''}
                                                    onChange={(e) => handleChemicalUsageChange(index, ingredient.id, e.target.value)}
                                                    className="w-24 p-1 border rounded-md"
                                                    placeholder="0.0"
                                                />
                                                <span className="text-sm text-gray-500 w-16 text-left">{ingredient.unit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            </div>
        )
    };
    
    const allStepsCompleted = aiPlan?.steps.every(step => step.completed);

    return (
        <div className="space-y-6 animate-fade-in">
             <button onClick={onExit} className="flex items-center gap-2 text-brand-primary font-semibold hover:underline">
                <ChevronLeft size={20} /> Back to My Jobs
            </button>
            <div className="bg-white p-6 rounded-xl shadow-md">
                 <h1 className="text-2xl font-bold text-gray-800 font-display">Interactive Job Sheet</h1>
                 <p className="text-gray-500">Job: {job.id} for {job.customer.name}</p>
            </div>
            
            {renderPlan()}

            {allStepsCompleted && (
                <div className="bg-white p-6 rounded-xl shadow-md space-y-4 mt-6 animate-fade-in">
                    <h3 className="text-xl font-bold text-gray-800 text-center">Final Steps</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button onClick={() => handleMarkJobComplete('Card')} className="flex items-center justify-center gap-2 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors">
                            <CreditCard size={18}/> Paid by Card
                        </button>
                        <button onClick={() => handleMarkJobComplete('Cash')} className="flex items-center justify-center gap-2 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                            <Banknote size={18}/> Paid by Cash
                        </button>
                        <button onClick={() => handleMarkJobComplete('Check')} className="flex items-center justify-center gap-2 bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors">
                            <Check size={18}/> Paid by Check
                        </button>
                    </div>
                </div>
            )}
            
            <div className="mt-4">
                 <button onClick={handleMarkDelayed} className="w-full flex items-center justify-center gap-2 bg-red-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-red-600 transition-colors">
                    <AlertTriangle size={18}/> Mark as Delayed/Incomplete
                </button>
            </div>
        </div>
    );
};

export default InteractiveJobSheet;