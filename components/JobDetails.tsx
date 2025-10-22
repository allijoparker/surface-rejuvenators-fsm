import React from 'react';
import { Job, JobStatus, UserRole, JobDetailsProps } from '../types';
// FIX: Added 'Briefcase' to the import from lucide-react.
import { ChevronLeft, User, MapPin, Phone, Mail, DollarSign, Calendar, Clock, Send, Link as LinkIcon, PenSquare, Download, Eye, Briefcase } from 'lucide-react';

const JobDetails: React.FC<JobDetailsProps> = ({ job, onBack, userRole, updateJobStatus, onSendQuote, onPreviewQuote }) => {
  
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateJobStatus(job.id, e.target.value as JobStatus);
  };
  
  const handleCopyLink = () => {
    if(job.publicQuoteUrl) {
      navigator.clipboard.writeText(job.publicQuoteUrl);
      alert('Quote link copied to clipboard!');
    }
  }
  
  const handleDownload = () => {
    window.print();
  };

  const InfoRow: React.FC<{ icon: React.ElementType, label: string, value: string | React.ReactNode }> = ({ icon: Icon, label, value }) => (
      <div className="flex items-start gap-3 py-2">
          <Icon className="h-5 w-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="font-semibold text-gray-800">{value}</p>
          </div>
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="print:hidden">
            <button onClick={onBack} className="flex items-center gap-2 text-brand-primary font-semibold hover:underline mb-4">
                <ChevronLeft size={20} /> Back to List
            </button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 font-display">Job Details</h1>
                    <p className="text-gray-500">ID: {job.id}</p>
                </div>
                 <div className="flex items-center gap-3 print:hidden">
                    <span className={`px-3 py-1 text-sm font-semibold rounded-full text-white bg-blue-500`}>{job.status}</span>
                    {userRole === 'ADMIN' && (
                         <select value={job.status} onChange={handleStatusChange} className="p-2 border rounded-md bg-gray-50">
                            {Object.values(JobStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>
        </div>
        
        {userRole === 'ADMIN' && (
            <div className="bg-white p-6 rounded-xl shadow-md print:hidden">
                 <h2 className="text-xl font-bold text-gray-800 mb-4 font-display flex items-center gap-2"><Send /> Quote Actions</h2>
                <div className="flex flex-wrap items-center gap-3">
                    <button onClick={handleDownload} className="flex items-center gap-2 bg-gray-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                        <Download size={18} /> Download Quote (PDF)
                    </button>
                    {job.status === JobStatus.QUOTED && (
                        <button onClick={() => onSendQuote(job.id)} className="flex items-center gap-2 bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-primary-dark transition-colors">
                            Generate & Send Quote Link
                        </button>
                    )}
                </div>
                {job.status === JobStatus.AWAITING_APPROVAL && job.publicQuoteUrl && (
                    <div className="mt-4">
                        <p className="text-gray-600 mb-2">Quote link generated. Share this with the customer:</p>
                        <div className="flex items-center gap-2">
                           <input type="text" readOnly value={job.publicQuoteUrl} className="w-full p-2 border rounded-md bg-gray-100" />
                           <button onClick={handleCopyLink} className="flex-shrink-0 flex items-center gap-2 bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                            <LinkIcon size={16} /> Copy
                           </button>
                           <button onClick={() => onPreviewQuote(job)} className="flex-shrink-0 flex items-center gap-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors" title="Preview the client-facing quote page">
                            <Eye size={16} /> Preview
                           </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Note: The public link may not work directly in this sandbox environment. Use the Preview button to test the client view.</p>
                    </div>
                )}
                 {job.customerSignature && (
                    <div className="mt-4">
                        <h3 className="font-semibold text-gray-700 mb-2 flex items-center gap-2"><PenSquare /> Customer Signature</h3>
                        <div className="bg-gray-100 border rounded-lg p-2 flex justify-center">
                            <img src={job.customerSignature} alt="Customer Signature" className="h-24 object-contain" />
                        </div>
                    </div>
                )}
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4 font-display flex items-center gap-2"><User /> Customer</h2>
                <InfoRow icon={User} label="Name" value={job.customer.name} />
                <InfoRow icon={MapPin} label="Address" value={job.customer.address} />
                <InfoRow icon={Phone} label="Phone" value={<a href={`tel:${job.customer.phone}`} className="text-brand-primary hover:underline">{job.customer.phone}</a>} />
                <InfoRow icon={Mail} label="Email" value={<a href={`mailto:${job.customer.email}`} className="text-brand-primary hover:underline">{job.customer.email}</a>} />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                 <h2 className="text-xl font-bold text-gray-800 mb-4 font-display flex items-center gap-2"><Briefcase /> Job Info</h2>
                <InfoRow icon={Calendar} label="Scheduled Date" value={job.scheduledDate.toLocaleDateString()} />
                 <InfoRow icon={Clock} label="Scheduled Time" value={job.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} />
                <InfoRow icon={DollarSign} label="Quote Total" value={`${job.quoteTotalRange.min === job.quoteTotalRange.max ? `$${job.quoteTotalRange.max.toFixed(2)}` :`$${job.quoteTotalRange.min.toFixed(2)} - $${job.quoteTotalRange.max.toFixed(2)}`}`} />
            </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md">
             <h2 className="text-xl font-bold text-gray-800 mb-4 font-display">Services Quoted</h2>
             <div className="space-y-4">
                 {job.services.map((item, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                        <div className="flex justify-between items-start">
                             <div>
                                <p className="font-bold text-lg text-gray-800">{item.service.name} <span className="text-sm font-normal text-gray-500">({item.customerType})</span></p>
                                <p className="text-sm text-gray-600">{item.quantity} {item.service.unit}</p>
                                {item.notes && <p className="text-xs text-gray-500 mt-1 italic">Notes: {item.notes}</p>}
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
                ))}
             </div>
        </div>
    </div>
  );
};

export default JobDetails;