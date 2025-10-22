import React from 'react';
import { Job, InventoryItem } from '../../types';
import { FORMULA_INGREDIENTS, INITIAL_INVENTORY, SERVICE_EQUIPMENT_MAP, SERVICES } from '../../constants';
import { ChevronLeft, ChevronsRight, ClipboardList, Package, Wrench, Droplets } from 'lucide-react';

interface JobSummaryProps {
    job: Job;
    onNext: () => void;
    onExit: () => void;
}

const Section: React.FC<{ title: string; items: InventoryItem[]; icon: React.ElementType }> = ({ title, items, icon: Icon }) => {
    if (items.length === 0) return null;
    return (
        <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
                <Icon className="h-5 w-5 text-brand-primary-dark" />
                <h3 className="font-semibold text-gray-700">{title}</h3>
            </div>
            <ul className="space-y-1 list-disc list-inside text-gray-600 pl-2">
                {items.map(item => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
};


const JobSummary: React.FC<JobSummaryProps> = ({ job, onNext, onExit }) => {
    
    const requiredChemicalIds = new Set<string>();
    job.services.forEach(quoteItem => {
        const fullService = SERVICES.find(s => s.id === quoteItem.service.id);
        if (fullService) {
             const selectedFormulas = new Set<string>();
            // Correctly gather formulas: check each selected tier for its own `includes`,
            // otherwise use the main service's `includes`.
            quoteItem.tiers.forEach(tier => {
                const formulasToUse = tier.includes || fullService.includes || [];
                formulasToUse.forEach(formula => selectedFormulas.add(formula));
            });
            
            selectedFormulas.forEach(formula => {
                 const ingredients = FORMULA_INGREDIENTS[formula];
                 if (ingredients) {
                    ingredients.forEach(id => requiredChemicalIds.add(id));
                }
            });

            // Handle add-ons
            quoteItem.addOns.forEach(addOn => {
                const addOnFormulaName = addOn.name;
                const ingredients = FORMULA_INGREDIENTS[addOnFormulaName];
                if (ingredients) {
                    ingredients.forEach(id => requiredChemicalIds.add(id));
                }
            });
        }
    });

    // Get required equipment IDs
    const requiredEquipmentIds = new Set<string>(SERVICE_EQUIPMENT_MAP['base'] || []);
    job.services.forEach(s => {
        const specificEquipment = SERVICE_EQUIPMENT_MAP[s.service.id];
        if (specificEquipment) {
            specificEquipment.forEach(id => requiredEquipmentIds.add(id));
        }
    });

    // Get full item details from inventory
    const requiredChemicals = INITIAL_INVENTORY.filter(item => item.category === 'chemical' && requiredChemicalIds.has(item.id));
    const requiredEquipment = INITIAL_INVENTORY.filter(item => item.category === 'equipment' && requiredEquipmentIds.has(item.id));

    return (
        <div className="space-y-6 animate-fade-in">
            <button onClick={onExit} className="flex items-center gap-2 text-brand-primary font-semibold hover:underline">
                <ChevronLeft size={20} /> Back to My Jobs
            </button>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-4">
                    <ClipboardList className="h-8 w-8 text-brand-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 font-display">Job Summary: {job.id}</h1>
                        <p className="text-gray-500">For: {job.customer.name} at {job.customer.address}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                 <div className="flex items-center gap-3 mb-4 border-b pb-3">
                    <Package className="h-6 w-6 text-brand-primary" />
                    <h2 className="text-xl font-bold text-gray-800 font-display">Required Items Checklist</h2>
                </div>
                
                <Section title="Chemicals" items={requiredChemicals} icon={Droplets} />
                <Section title="Equipment" items={requiredEquipment} icon={Wrench} />

                {requiredChemicals.length === 0 && requiredEquipment.length === 0 && (
                     <p className="text-gray-500 mt-4">No specific chemicals or equipment listed for this job type.</p>
                )}
            </div>

            <button
                onClick={onNext}
                className="w-full flex items-center justify-center gap-3 bg-brand-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-brand-primary-dark transition-colors duration-300 text-lg shadow-lg"
            >
                Supplies Loaded, Get On The Road
                <ChevronsRight size={22} />
            </button>
        </div>
    );
};

export default JobSummary;