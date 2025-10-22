import React from 'react';
import { Job } from '../../types';
import { User, MapPin, Phone, Navigation, CheckCircle, ChevronLeft } from 'lucide-react';

interface CustomerInfoProps {
    job: Job;
    onNext: () => void;
    onBack: () => void;
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ job, onNext, onBack }) => {
    
    const handleGetDirections = () => {
        const url = `https://maps.google.com/?q=${encodeURIComponent(job.customer.address)}`;
        window.open(url, '_blank');
    };

    const handleArrived = () => {
        // Here you could trigger a notification to the customer via an API
        alert(`Notification sent to ${job.customer.name} that you have arrived.`);
        onNext();
    }
    
    return (
         <div className="space-y-6 animate-fade-in">
             <button onClick={onBack} className="flex items-center gap-2 text-brand-primary font-semibold hover:underline">
                <ChevronLeft size={20} /> Back to Job Summary
            </button>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center gap-3 mb-4">
                    <User className="h-8 w-8 text-brand-primary" />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 font-display">Customer Info</h1>
                        <p className="text-gray-500">{job.customer.name}</p>
                    </div>
                </div>
                <div className="space-y-3 mt-4 text-gray-700">
                    <p className="flex items-center gap-3">
                        <MapPin size={18} className="text-gray-400"/>
                        {job.customer.address}
                    </p>
                    <p className="flex items-center gap-3">
                        <Phone size={18} className="text-gray-400"/>
                        {job.customer.phone}
                    </p>
                </div>
            </div>
            
            <button
                onClick={handleGetDirections}
                className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300 text-lg shadow-lg"
            >
                Get Directions
                <Navigation size={22} />
            </button>

            <button
                onClick={handleArrived}
                className="w-full flex items-center justify-center gap-3 bg-green-500 text-white font-bold py-4 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 text-lg shadow-lg"
            >
                I've Arrived
                <CheckCircle size={22} />
            </button>

        </div>
    );
};

export default CustomerInfo;
