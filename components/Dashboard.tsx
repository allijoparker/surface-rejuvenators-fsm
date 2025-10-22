
import React, { useState } from 'react';
import { Job, InventoryItem, JobStatus, CalendarEvent } from '../types';
import { Bell, Briefcase, CheckCircle, Clock, PlusCircle, Calendar as CalendarIcon, BarChart2 } from 'lucide-react';
import moment from 'moment';
import SimpleCalendar from './common/SimpleCalendar';

interface DashboardProps {
  jobs: Job[];
  lowStockItems: InventoryItem[];
  onNewQuote: () => void;
  onJobSelect: (job: Job) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ jobs, lowStockItems, onNewQuote, onJobSelect }) => {
  const [view, setView] = useState<'stats' | 'calendar'>('stats');

  const jobCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {} as Record<JobStatus, number>);

    const events: CalendarEvent[] = jobs
    .filter(job => job.status === JobStatus.SCHEDULED || job.status === JobStatus.IN_PROGRESS || job.status === JobStatus.COMPLETED)
    .map(job => ({
        title: `${job.id} - ${job.customer.name}`,
        start: job.scheduledDate,
        resource: job,
    }));

  const handleSelectEvent = (event: CalendarEvent) => {
      onJobSelect(event.resource);
  };

  const StatCard: React.FC<{ title: string; value: number; icon: React.ElementType, color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between transition-transform hover:scale-105">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`rounded-full p-3 ${color}`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800 font-display">Admin Dashboard</h1>
        <div className="flex items-center gap-2 p-1 bg-gray-200 rounded-lg">
          <button onClick={() => setView('stats')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center gap-2 ${view === 'stats' ? 'bg-white text-brand-primary shadow' : 'text-gray-600'}`}>
            <BarChart2 className="w-5 h-5" />
            Stats
          </button>
          <button onClick={() => setView('calendar')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors flex items-center gap-2 ${view === 'calendar' ? 'bg-white text-brand-primary shadow' : 'text-gray-600'}`}>
            <CalendarIcon className="w-5 h-5" />
            Calendar
          </button>
        </div>
      </div>

      {view === 'stats' ? (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Jobs" value={jobs.length} icon={Briefcase} color="bg-blue-500" />
            <StatCard title="Leads / Quoted" value={(jobCounts[JobStatus.LEAD] || 0) + (jobCounts[JobStatus.QUOTED] || 0)} icon={PlusCircle} color="bg-yellow-500" />
            <StatCard title="In Progress" value={jobCounts[JobStatus.IN_PROGRESS] || 0} icon={Clock} color="bg-indigo-500" />
            <StatCard title="Completed" value={jobCounts[JobStatus.COMPLETED] || 0} icon={CheckCircle} color="bg-green-500" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4 font-display">Quick Actions</h2>
              <button
                onClick={onNewQuote}
                className="w-full flex items-center justify-center gap-2 bg-brand-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-primary-dark transition-colors duration-300"
              >
                <PlusCircle className="h-5 w-5" />
                Create New Quote
              </button>
            </div>

            {/* Inventory Alerts */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-bold text-gray-800 mb-4 font-display">Inventory Alerts</h2>
              {lowStockItems.length > 0 ? (
                <ul className="space-y-3">
                  {lowStockItems.map(item => (
                    <li key={item.id} className="flex items-center justify-between bg-red-50 border border-red-200 p-3 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-red-500" />
                        <div>
                          <p className="font-semibold text-gray-700">{item.name}</p>
                          <p className="text-sm text-gray-500">Low stock level</p>
                        </div>
                      </div>
                      <p className="font-bold text-red-600">
                        {item.currentStock} / {item.threshold} {item.unit}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">All inventory levels are sufficient.</p>
              )}
            </div>
          </div>
        </>
      ) : (
        <SimpleCalendar events={events} onSelectEvent={handleSelectEvent} />
      )}
    </div>
  );
};

export default Dashboard;
