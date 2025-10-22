import React, { useState, useMemo, useEffect } from 'react';
import { Service, Tier, AddOn, QuoteItem } from '../../types';
import { X, ArrowRight, ArrowLeft } from 'lucide-react';

interface AddServiceWizardProps {
  services: Service[];
  onSaveService: (item: QuoteItem, editIndex: number | null) => void;
  onClose: () => void;
  initialData?: QuoteItem | null;
  editIndex?: number | null;
}

const AddServiceWizard: React.FC<AddServiceWizardProps> = ({ services, onSaveService, onClose, initialData = null, editIndex = null }) => {
  const [step, setStep] = useState(1);
  const [customerType, setCustomerType] = useState<'Residential' | 'Commercial'>(initialData?.customerType || 'Residential');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialData?.service.category || null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(initialData?.service.subCategory || null);
  const [selectedService, setSelectedService] = useState<Service | null>(initialData?.service || null);
  const [quantity, setQuantity] = useState(initialData?.quantity || 1);
  const [selectedTiers, setSelectedTiers] = useState<Tier[]>(initialData?.tiers || []);
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>(initialData?.addOns || []);
  const [notes, setNotes] = useState(initialData?.notes || '');
  
  // Pre-populate steps if editing
  useEffect(() => {
    if (initialData) {
      setStep(5); // Go directly to details step
    }
  }, [initialData]);

  // --- Filtered Lists ---
  const availableCategories = useMemo(() => {
      const filtered = services.filter(s => s.appliesTo.includes(customerType));
      return [...new Set(filtered.map(s => s.category))];
  }, [services, customerType]);
  
  const availableSubCategories = useMemo(() => {
    if (!selectedCategory) return [];
    const filtered = services.filter(s => s.category === selectedCategory && s.appliesTo.includes(customerType));
    return [...new Set(filtered.map(s => s.subCategory))];
  }, [services, selectedCategory, customerType]);

  const availableServices = useMemo(() => {
    if (!selectedCategory || !selectedSubCategory) return [];
    return services.filter(s => 
        s.category === selectedCategory && 
        s.subCategory === selectedSubCategory &&
        s.appliesTo.includes(customerType)
    );
  }, [services, selectedCategory, selectedSubCategory, customerType]);

  // --- Handlers ---
  const handleSelectCustomerType = (type: 'Residential' | 'Commercial') => {
    setCustomerType(type);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSelectedService(null);
    setStep(2);
  };
  
  const handleSelectCategory = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setSelectedService(null);
    setStep(3);
  };
  
  const handleSelectSubCategory = (subCategory: string) => {
      setSelectedSubCategory(subCategory);
      setSelectedService(null);
      setStep(4);
  }

  const handleSelectService = (service: Service) => {
    setSelectedService(service);
    setSelectedTiers([]);
    setSelectedAddOns([]);
    setQuantity(1);
    setNotes('');
    setStep(5);
  };
  
  const toggleTier = (tier: Tier) => {
    setSelectedTiers(prev => {
        const isSelected = prev.some(t => t.id === tier.id);
        return isSelected ? prev.filter(t => t.id !== tier.id) : [...prev, tier];
    });
  };

  const toggleAddOn = (addOn: AddOn) => {
    setSelectedAddOns(prev =>
      prev.find(a => a.id === addOn.id) ? prev.filter(a => a.id !== addOn.id) : [...prev, addOn]
    );
  };

  const calculatePriceRange = (): { min: number; max: number } => {
    if (!selectedService || selectedTiers.length === 0) return { min: 0, max: 0 };
    
    const tierMultipliers = selectedTiers.map(t => t.priceMultiplier);
    const minTierMultiplier = Math.min(...tierMultipliers);
    const maxTierMultiplier = Math.max(...tierMultipliers);

    const minPrice = selectedService.basePrice * quantity * minTierMultiplier;
    const maxPrice = selectedService.basePrice * quantity * maxTierMultiplier;

    return { min: minPrice, max: maxPrice };
  };

  const handleSave = () => {
    if (!selectedService) return;
    
    const priceRange = calculatePriceRange();
    
    const newItem: QuoteItem = {
      service: selectedService,
      customerType,
      quantity,
      tiers: selectedTiers,
      addOns: selectedAddOns,
      notes,
      priceRange,
    };
    onSaveService(newItem, editIndex);
    onClose();
  };
  
  const priceRange = calculatePriceRange();
  
  const getStepTitle = () => {
      switch(step) {
          case 1: return "Select Customer Type";
          case 2: return "Select Service Category";
          case 3: return `Category: ${selectedCategory}`;
          case 4: return `Type: ${selectedSubCategory}`;
          case 5: return `Configure: ${selectedService?.name}`;
          default: return "Add Service";
      }
  }
  
  const getUnitLabel = () => {
      if (!selectedService) return "Quantity";
      const unitMap = {
          'sq ft': 'Area (Sq. Ft.)',
          'lf': 'Length (LF)',
          'window': 'Number of Windows',
          'hour': 'Estimated Hours',
          'item': 'Number of Items',
          'job': 'Job'
      };
      return unitMap[selectedService.unit] || "Quantity";
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 animate-fade-in-fast">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl transform transition-all flex flex-col max-h-[90vh]">
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 font-display">{getStepTitle()}</h2>
          <button onClick={onClose} className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800"><X /></button>
        </div>

        <div className="p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-center text-gray-600 mb-4">Is this for a residential or commercial property?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => handleSelectCustomerType('Residential')} className="text-lg text-center p-6 bg-gray-50 rounded-lg hover:bg-brand-secondary hover:shadow-md transition-all font-bold text-gray-700">Residential</button>
                  <button onClick={() => handleSelectCustomerType('Commercial')} className="text-lg text-center p-6 bg-gray-50 rounded-lg hover:bg-brand-secondary hover:shadow-md transition-all font-bold text-gray-700">Commercial</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableCategories.map(cat => (
                <button key={cat} onClick={() => handleSelectCategory(cat)} className="text-left p-4 bg-gray-50 rounded-lg hover:bg-brand-secondary hover:shadow-md transition-all focus:ring-2 focus:ring-brand-primary outline-none">
                  <span className="font-bold text-gray-700">{cat}</span>
                </button>
              ))}
            </div>
          )}
          
          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableSubCategories.map(subCat => (
                    <button key={subCat} onClick={() => handleSelectSubCategory(subCat)} className="text-left p-4 bg-gray-50 rounded-lg hover:bg-brand-secondary hover:shadow-md transition-all focus:ring-2 focus:ring-brand-primary outline-none">
                        <span className="font-bold text-gray-700">{subCat}</span>
                    </button>
                ))}
            </div>
          )}

          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableServices.map(service => (
                    <button key={service.id} onClick={() => handleSelectService(service)} className="text-left p-3 border rounded-lg hover:border-brand-primary hover:bg-brand-secondary transition-all focus:ring-2 focus:ring-brand-primary outline-none">
                        <p className="font-semibold">{service.name}</p>
                        <p className="text-xs text-gray-500">{service.description}</p>
                    </button>
                ))}
            </div>
          )}

          {step === 5 && selectedService && (
            <div className="space-y-6">
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">{getUnitLabel()}</label>
                    <input
                      type="number"
                      id="quantity"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="w-full p-2 border rounded-md"
                    />
                </div>
                {selectedService.tiers.length > 0 && (
                    <div>
                        <h4 className="text-md font-medium text-gray-700 mb-2">Soil Level / Tier <span className="text-xs font-normal text-gray-500">(Select multiple for a blind estimate)</span></h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                            {selectedService.tiers.map(tier => (
                                <button
                                    key={tier.id}
                                    onClick={() => toggleTier(tier)}
                                    className={`p-3 border rounded-lg text-left transition-all text-sm ${selectedTiers.some(t => t.id === tier.id) ? 'bg-brand-secondary border-brand-primary ring-2 ring-brand-primary' : 'bg-white hover:bg-gray-50'}`}
                                >
                                    <p className="font-semibold">{tier.name}</p>
                                    <p className="text-xs">{tier.description}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                 {selectedService.addOns.length > 0 && (
                    <div>
                         <h4 className="text-md font-medium text-gray-700 mb-2">Available Add-Ons</h4>
                         <div className="space-y-2">
                            {selectedService.addOns.map(addOn => (
                            <label key={addOn.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                                <input
                                    type="checkbox"
                                    checked={selectedAddOns.some(a => a.id === addOn.id)}
                                    onChange={() => toggleAddOn(addOn)}
                                    className="h-5 w-5 rounded text-brand-primary focus:ring-brand-primary"
                                />
                                <div>
                                    <p className="font-semibold text-gray-800">{addOn.name} (+${addOn.unitBased ? `${addOn.price}/${selectedService.unit}` : `${addOn.price.toFixed(2)}`})</p>
                                    <p className="text-xs text-gray-600">{addOn.description}</p>
                                </div>
                            </label>
                            ))}
                        </div>
                    </div>
                )}
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
                    <textarea id="notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="w-full p-2 border rounded-md" placeholder="e.g., Pay special attention to the north side..."></textarea>
                </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 rounded-b-xl mt-auto border-t flex items-center justify-between">
            <div>
              {step > 1 && !initialData && <button onClick={() => setStep(prev => prev - 1)} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 rounded-lg"><ArrowLeft size={16}/> Back</button>}
            </div>
            {step === 5 ? (
                <div className="flex items-center gap-4">
                     <div className="text-right">
                        <p className="text-sm text-gray-500">Price Range</p>
                        <p className="font-bold text-xl text-gray-800">
                            {priceRange.min === priceRange.max ? `$${priceRange.max.toFixed(2)}` : `$${priceRange.min.toFixed(2)} - $${priceRange.max.toFixed(2)}`}
                        </p>
                     </div>
                    <button
                        onClick={handleSave}
                        disabled={!selectedService || (selectedService.tiers.length > 0 && selectedTiers.length === 0)}
                        className="flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-5 rounded-lg hover:bg-brand-primary-dark transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {initialData ? 'Update Service' : 'Add to Quote'} <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            ) : <div />}
        </div>
      </div>
    </div>
  );
};

export default AddServiceWizard;
