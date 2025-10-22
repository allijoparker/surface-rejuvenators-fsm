import React, { useState, useMemo } from 'react';
import { PublicQuotePageProps, Tier, AddOn } from '../types';
import SignaturePad from './common/SignaturePad';
import Logo from './common/Logo';
import { Check, Download, X } from 'lucide-react';

const PublicQuotePage: React.FC<PublicQuotePageProps> = ({ job, onApproveQuote, isPreview = false, onExitPreview }) => {
  const [selections, setSelections] = useState(job.customerSelections || {});
  const [signatureData, setSignatureData] = useState<string | null>(null);

  const handleTierSelect = (serviceIndex: number, tier: Tier) => {
    setSelections(prev => ({
      ...prev,
      [serviceIndex]: { ...(prev[serviceIndex] || { addOnIds: [] }), tierId: tier.id }
    }));
  };

  const handleAddOnToggle = (serviceIndex: number, addOn: AddOn) => {
    setSelections(prev => {
      const currentSelection = prev[serviceIndex] || { tierId: '', addOnIds: [] };
      const newAddOnIds = currentSelection.addOnIds.includes(addOn.id)
        ? currentSelection.addOnIds.filter(id => id !== addOn.id)
        : [...currentSelection.addOnIds, addOn.id];
      return {
        ...prev,
        [serviceIndex]: { ...currentSelection, addOnIds: newAddOnIds }
      };
    });
  };

  const finalPrice = useMemo(() => {
    return job.services.reduce((total, item, index) => {
      const selection = selections[index];
      if (!selection || !selection.tierId) return total;

      const selectedTier = item.tiers.find(t => t.id === selection.tierId);
      if (!selectedTier) return total;

      let itemTotal = item.service.basePrice * item.quantity * selectedTier.priceMultiplier;

      (selection.addOnIds || []).forEach(addOnId => {
        const addOn = item.addOns.find(a => a.id === addOnId);
        if (addOn) {
          itemTotal += addOn.unitBased ? addOn.price * item.quantity : addOn.price;
        }
      });
      return total + itemTotal;
    }, 0);
  }, [job.services, selections]);

  const allOptionsSelected = useMemo(() => {
    return job.services.every((item, index) => {
        if (item.tiers.length === 0) return true; // No options to select
        return selections[index] && selections[index].tierId;
    });
  }, [job.services, selections]);

  const handleSubmit = () => {
    if (isPreview) {
        alert("This is a preview. Approval is disabled.");
        return;
    }
    if (!allOptionsSelected) {
      alert('Please make a selection for each service option.');
      return;
    }
    if (!signatureData) {
      alert('Please sign the quote to approve.');
      return;
    }
    onApproveQuote(job.id, selections, signatureData, finalPrice);
  };
  
  const handlePrint = () => {
      window.print();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-10">
      {isPreview && onExitPreview && (
          <div className="fixed top-0 left-0 right-0 bg-yellow-400 p-3 text-center text-yellow-900 font-bold z-50 print:hidden">
              You are in Admin Preview Mode.
              <button onClick={onExitPreview} className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-yellow-800 text-white font-semibold py-1 px-3 rounded-lg hover:bg-yellow-900 transition-colors">
                 <X size={18}/> Exit Preview
              </button>
          </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b print:hidden">
        <div className="flex items-center gap-4">
            <Logo className="h-12 w-auto"/>
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 font-display">Service Quote</h1>
                <p className="text-gray-500">For: {job.customer.name}</p>
            </div>
        </div>
        <button onClick={handlePrint} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors self-start sm:self-center">
            <Download size={18} /> Download Quote
        </button>
      </div>

      <div className="mt-6">
        {job.services.map((item, index) => (
          <div key={index} className="mb-6 pb-6 border-b last:border-b-0">
            <h2 className="text-xl font-bold text-gray-800">{item.service.name}</h2>
            <p className="text-sm text-gray-500">{item.quantity} {item.service.unit}</p>

            <div className="mt-4">
              <h3 className="font-semibold text-gray-700">Please select an option:</h3>
              <div className="mt-2 space-y-2">
                {item.tiers.map(tier => (
                  <label key={tier.id} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${selections[index]?.tierId === tier.id ? 'bg-blue-50 border-blue-400 ring-2 ring-blue-300' : 'bg-gray-50 hover:bg-gray-100'}`}>
                    <input
                      type="radio"
                      name={`service-${index}-tier`}
                      checked={selections[index]?.tierId === tier.id}
                      onChange={() => handleTierSelect(index, tier)}
                      className="h-5 w-5 mt-0.5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <div className="ml-3 flex-1">
                      <p className="font-bold text-gray-800">{tier.name}</p>
                      <p className="text-sm text-gray-600">{tier.description}</p>
                    </div>
                    <p className="font-semibold text-lg text-gray-900">${(item.service.basePrice * item.quantity * tier.priceMultiplier).toFixed(2)}</p>
                  </label>
                ))}
              </div>
            </div>

            {item.addOns.length > 0 && (
              <div className="mt-4">
                <h3 className="font-semibold text-gray-700">Optional Add-Ons:</h3>
                <div className="mt-2 space-y-2">
                  {item.addOns.map(addOn => (
                    <label key={addOn.id} className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all ${selections[index]?.addOnIds?.includes(addOn.id) ? 'bg-green-50 border-green-400 ring-2 ring-green-300' : 'bg-gray-50 hover:bg-gray-100'}`}>
                      <input
                        type="checkbox"
                        checked={selections[index]?.addOnIds?.includes(addOn.id) || false}
                        onChange={() => handleAddOnToggle(index, addOn)}
                        className="h-5 w-5 mt-0.5 rounded text-green-600 focus:ring-green-500 border-gray-300"
                      />
                       <div className="ml-3 flex-1">
                        <p className="font-bold text-gray-800">{addOn.name}</p>
                        <p className="text-sm text-gray-600">{addOn.description}</p>
                       </div>
                       <p className="font-semibold text-lg text-gray-900">+${(addOn.unitBased ? addOn.price * item.quantity : addOn.price).toFixed(2)}</p>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 flex justify-end">
          <div className="text-right">
              <p className="text-gray-600">Final Total</p>
              <p className="text-4xl font-bold text-brand-primary">${finalPrice.toFixed(2)}</p>
          </div>
      </div>

      <div className="mt-8 print:hidden">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Terms & Conditions</h2>
        <div className="prose prose-sm max-w-none p-4 bg-gray-50 border rounded-md h-32 overflow-y-auto">
          <p>By signing this quote, you ("Client") agree to the terms set forth by Surface Rejuvenators LLC ("Company").</p>
          <p><strong>Warranty:</strong> Company warrants that all work will be performed in a professional and workmanlike manner. All cleaning solutions are eco-friendly and biodegradable. Company is not responsible for pre-existing damage, loose siding, or improperly sealed windows. A full warranty document is available upon request.</p>
          <p><strong>Payment:</strong> Payment is due upon completion of the services outlined in this agreement. Any changes to the scope of work must be agreed upon in writing and may result in additional charges.</p>
          <p><strong>Cancellation:</strong> Client may cancel this agreement up to 48 hours before the scheduled service time without penalty. Cancellations within 48 hours may be subject to a cancellation fee.</p>
        </div>

        <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-2">Please sign below to approve this quote and schedule your service:</h3>
            <SignaturePad onSignatureChange={setSignatureData} width={500} height={150} />
        </div>
        
        <div className="mt-8 text-center">
            <button
                onClick={handleSubmit}
                disabled={!allOptionsSelected || !signatureData}
                className="w-full sm:w-auto flex items-center justify-center gap-3 bg-green-500 text-white font-bold py-4 px-8 rounded-lg hover:bg-green-600 transition-colors duration-300 text-lg shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
                <Check size={24}/> Approve & Sign Contract
            </button>
        </div>
      </div>
    </div>
  );
};
export default PublicQuotePage;
