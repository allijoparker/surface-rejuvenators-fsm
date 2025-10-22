import React, { useState, useMemo } from 'react';
import { Service, QuoteItem, Customer, Job, JobStatus } from '../types';
import { PlusCircle, Trash2, Save, XCircle, User, Mail, Phone, MapPin, Edit } from 'lucide-react';
import AddServiceWizard from './quote/AddServiceWizard';

interface QuoteToolProps {
  services: Service[];
  onSaveQuote: (newJob: Omit<Job, 'id'>) => void;
  onCancel: () => void;
}

const QuoteTool: React.FC<QuoteToolProps> = ({ services, onSaveQuote, onCancel }) => {
  const [customer, setCustomer] = useState<Omit<Customer, 'id'>>({ name: '', email: '', phone: '', address: '' });
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{ item: QuoteItem; index: number } | null>(null);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveService = (item: QuoteItem, editIndex: number | null) => {
    if (editIndex !== null) {
      // Update existing item
      setQuoteItems(prev => prev.map((oldItem, i) => (i === editIndex ? item : oldItem)));
    } else {
      // Add new item
      setQuoteItems(prev => [...prev, item]);
    }
    setEditingItem(null);
    setIsWizardOpen(false);
  };
  
  const handleOpenWizardForEdit = (item: QuoteItem, index: number) => {
      setEditingItem({ item, index });
      setIsWizardOpen(true);
  }
  
  const handleOpenWizardForNew = () => {
      setEditingItem(null);
      setIsWizardOpen(true);
  }

  const handleRemoveService = (index: number) => {
    setQuoteItems(prev => prev.filter((_, i) => i !== index));
  };
  
  const quoteTotalRange = useMemo(() => {
    return quoteItems.reduce(
      (acc, item) => {
        acc.min += item.priceRange.min;
        acc.max += item.priceRange.max;
        return acc;
      },
      { min: 0, max: 0 }
    );
  }, [quoteItems]);

  const handleSave = () => {
    if (!customer.name || !customer.address || quoteItems.length === 0) {
        alert("Please fill in customer name, address, and add at least one service.");
        return;
    }

    const newJob: Omit<Job, 'id'> = {
        customer: { ...customer, id: `cust-${Date.now()}`},
        services: quoteItems,
        status: JobStatus.QUOTED,
        quoteTotalRange,
        scheduledDate: new Date(), // Placeholder, will be updated when scheduled
        jobSheet: {
            beforePhotos: [],
            afterPhotos: [],
            chemicalUsage: [],
            notes: ''
        }
    };
    onSaveQuote(newJob);
  };
  
  const isCustomerInfoValid = customer.name && customer.address && customer.email && customer.phone;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 font-display">Create New Quote</h1>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4 font-display flex items-center gap-2"><User /> Customer Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" name="name" placeholder="Full Name *" value={customer.name} onChange={handleCustomerChange} className="w-full p-2 pl-10 border rounded-md" />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" name="address" placeholder="Address *" value={customer.address} onChange={handleCustomerChange} className="w-full p-2 pl-10 border rounded-md" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="email" name="email" placeholder="Email *" value={customer.email} onChange={handleCustomerChange} className="w-full p-2 pl-10 border rounded-md" />
          </div>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="tel" name="phone" placeholder="Phone *" value={customer.phone} onChange={handleCustomerChange} className="w-full p-2 pl-10 border rounded-md" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 font-display">Quoted Services</h2>
            <button 
                onClick={handleOpenWizardForNew} 
                className="flex items-center gap-2 bg-brand-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!isCustomerInfoValid}
                title={!isCustomerInfoValid ? "Please fill out all customer information first" : "Add a service to the quote"}
            >
                <PlusCircle size={20} /> Add Service
            </button>
        </div>
        <div className="space-y-4">
            {quoteItems.length > 0 ? quoteItems.map((item, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-start">
                         <div>
                            <p className="font-bold text-lg text-gray-800">{item.service.name} <span className="text-sm font-normal text-gray-500">({item.customerType})</span></p>
                            <p className="text-sm text-gray-600">{item.quantity} {item.service.unit}</p>
                            {item.notes && <p className="text-xs text-gray-500 mt-1 italic">Notes: {item.notes}</p>}
                         </div>
                         <div className="flex items-center gap-2">
                             <button onClick={() => handleOpenWizardForEdit(item, index)} className="p-2 text-blue-500 hover:bg-blue-100 rounded-full"><Edit size={16} /></button>
                            <button onClick={() => handleRemoveService(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 size={16} /></button>
                         </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t">
                       <h4 className="font-semibold text-gray-700 mb-2">Options:</h4>
                       <div className="space-y-1 pl-2">
                          {item.tiers.map(tier => (
                              <div key={tier.id} className="flex justify-between items-center text-sm">
                                  <p>{tier.name}: <span className="text-gray-500">{tier.description}</span></p>
                                  <p className="font-semibold text-gray-800">${(item.service.basePrice * item.quantity * tier.priceMultiplier).toFixed(2)}</p>
                              </div>
                          ))}
                       </div>
                    </div>
                    
                    {item.addOns.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                            <h4 className="font-semibold text-gray-700 mb-2">Optional Add-Ons:</h4>
                            <div className="space-y-1 pl-2">
                                {item.addOns.map(addOn => {
                                    const addOnPrice = addOn.unitBased ? addOn.price * item.quantity : addOn.price;
                                    return (
                                        <div key={addOn.id} className="flex justify-between items-center text-sm">
                                            <p>{addOn.name}: <span className="text-gray-500">{addOn.description}</span></p>
                                            <p className="font-semibold text-gray-800">+${addOnPrice.toFixed(2)}</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 pl-2">*Add-on prices are in addition to the option totals above.</p>
                        </div>
                    )}
                </div>
            )) : <p className="text-center text-gray-500 py-4">No services added yet.</p>}
        </div>
      </div>
      
       <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
             <div className="text-left">
                <p className="text-sm text-gray-500">Total Quote Range (Options Only)</p>
                <p className="text-3xl font-bold text-brand-primary">
                    {quoteTotalRange.min === quoteTotalRange.max 
                        ? `$${quoteTotalRange.max.toFixed(2)}`
                        : `$${quoteTotalRange.min.toFixed(2)} - $${quoteTotalRange.max.toFixed(2)}`}
                </p>
             </div>
            <div className="flex justify-end gap-3">
                <button onClick={onCancel} className="flex items-center gap-2 bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                    <XCircle size={20} /> Cancel
                </button>
                <button onClick={handleSave} className="flex items-center gap-2 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors">
                    <Save size={20} /> Save Quote
                </button>
            </div>
        </div>
      </div>

      {isWizardOpen && (
        <AddServiceWizard 
            services={services}
            onSaveService={handleSaveService}
            onClose={() => { setIsWizardOpen(false); setEditingItem(null); }}
            initialData={editingItem?.item}
            editIndex={editingItem?.index}
        />
      )}
    </div>
  );
};

export default QuoteTool;
