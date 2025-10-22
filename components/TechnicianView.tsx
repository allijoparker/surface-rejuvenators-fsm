
import React from 'react';
import { Job, JobStatus } from '../types';
import { Calendar, Clock, MapPin } from 'lucide-react';

interface TechnicianViewProps {
  jobs: Job[];
  onJobSelect: (job: Job) => void;
}

const isToday = (someDate: Date) => {
    const today = new Date();
    return someDate.getDate() === today.getDate() &&
        someDate.getMonth() === today.getMonth() &&
        someDate.getFullYear() === today.getFullYear();
}

const TechnicianJobCard: React.FC<{ job: Job, onJobSelect: (job: Job) => void, isTodayJob: boolean }> = ({ job, onJobSelect, isTodayJob }) => {
    return (
        <div
            onClick={() => onJobSelect(job)}
            className={`bg-white p-5 rounded-xl shadow-md cursor-pointer border-l-8 ${isTodayJob ? 'border-green-500' : 'border-blue-500'} hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}
        >
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-gray-800 font-display">{job.customer.name}</h3>
                    <p className="flex items-center gap-2 text-gray-600 mt-1">
                        <MapPin size={16} />
                        {job.customer.address}
                    </p>
                </div>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${job.status === JobStatus.IN_PROGRESS ? 'bg-indigo-500' : 'bg-brand-primary'}`}>
                    {job.status}
                </span>
            </div>
            <div className="mt-4 border-t pt-4 flex items-center justify-between text-gray-500">
                <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{job.scheduledDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>{job.scheduledDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </div>
        </div>
    );
};


const TechnicianView: React.FC<TechnicianViewProps> = ({ jobs, onJobSelect }) => {
    const assignedJobs = jobs.filter(j => 
        j.status === JobStatus.SCHEDULED || j.status === JobStatus.IN_PROGRESS
    );

    const todayJobs = assignedJobs.filter(j => isToday(j.scheduledDate)).sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());
    const upcomingJobs = assignedJobs.filter(j => !isToday(j.scheduledDate)).sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime());

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 font-display">My Jobs</h1>
      
      <div>
        <h2 className="text-2xl font-semibold text-green-600 font-display mb-4">Today's Schedule</h2>
        {todayJobs.length > 0 ? (
            <div className="space-y-4">
                {todayJobs.map(job => (
                    <TechnicianJobCard key={job.id} job={job} onJobSelect={onJobSelect} isTodayJob={true} />
                ))}
            </div>
        ) : (
            <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">No jobs scheduled for today.</p>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold text-blue-600 font-display mb-4">Upcoming Jobs</h2>
        {upcomingJobs.length > 0 ? (
             <div className="space-y-4">
                {upcomingJobs.map(job => (
                    <TechnicianJobCard key={job.id} job={job} onJobSelect={onJobSelect} isTodayJob={false} />
                ))}
            </div>
        ) : (
            <p className="text-gray-500 bg-white p-4 rounded-lg shadow-sm">No upcoming jobs.</p>
        )}
      </div>

    </div>
  );
};

export default TechnicianView;
