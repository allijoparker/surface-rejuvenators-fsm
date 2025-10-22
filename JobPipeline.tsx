
import React from 'react';
import { Job, JobStatus } from './types';
import { MoreHorizontal } from 'lucide-react';

interface JobPipelineProps {
  jobs: Job[];
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  onJobSelect: (job: Job) => void;
}

const statusColors: Record<JobStatus, string> = {
  [JobStatus.LEAD]: 'bg-gray-400',
  [JobStatus.QUOTED]: 'bg-yellow-500',
  [JobStatus.AWAITING_APPROVAL]: 'bg-orange-500',
  [JobStatus.SCHEDULED]: 'bg-blue-500',
  [JobStatus.IN_PROGRESS]: 'bg-indigo-500',
  [JobStatus.DELAYED]: 'bg-red-500',
  [JobStatus.COMPLETED]: 'bg-green-500',
  [JobStatus.INVOICED]: 'bg-purple-500',
  [JobStatus.PAID]: 'bg-teal-500',
};

const JobCard: React.FC<{ job: Job, onJobSelect: (job: Job) => void }> = ({ job, onJobSelect }) => {
  return (
    <div 
      onClick={() => onJobSelect(job)}
      className="bg-white p-4 rounded-lg shadow-sm cursor-pointer border-l-4 border-brand-primary hover:shadow-lg transition-shadow duration-200 mb-3"
    >
      <div className="flex justify-between items-start">
        <div>
            <p className="font-bold text-gray-800">{job.customer.name}</p>
            <p className="text-sm text-gray-500">{job.customer.address}</p>
        </div>
        <MoreHorizontal className="text-gray-400" />
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-600">Total: <span className="font-semibold">
          {job.quoteTotalRange.min === job.quoteTotalRange.max 
              ? `$${job.quoteTotalRange.max.toFixed(2)}` 
              : `$${job.quoteTotalRange.min.toFixed(2)} - $${job.quoteTotalRange.max.toFixed(2)}`}
        </span></p>
        <p className="text-xs text-gray-400 mt-1">{job.id}</p>
      </div>
    </div>
  );
};

const JobPipelineColumn: React.FC<{ status: JobStatus; jobs: Job[]; onJobSelect: (job: Job) => void }> = ({ status, jobs, onJobSelect }) => {
  return (
    <div className="flex-1 min-w-[300px] bg-gray-100 rounded-xl p-4">
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${statusColors[status]}`}></div>
        <h2 className="font-bold text-lg text-gray-700 font-display">{status}</h2>
        <span className="text-sm font-semibold text-gray-500 bg-gray-200 rounded-full px-2 py-0.5">{jobs.length}</span>
      </div>
      <div className="space-y-3 h-full overflow-y-auto">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} onJobSelect={onJobSelect} />
        ))}
      </div>
    </div>
  );
};

const JobPipeline: React.FC<JobPipelineProps> = ({ jobs, onJobSelect }) => {
  const jobColumns = Object.values(JobStatus).map(status => ({
    status,
    jobs: jobs.filter(job => job.status === status),
  }));

  return (
    <div className="h-full flex flex-col">
       <h1 className="text-3xl font-bold text-gray-800 font-display mb-6">Job Pipeline</h1>
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {jobColumns.map(({ status, jobs }) => (
          <JobPipelineColumn key={status} status={status} jobs={jobs} onJobSelect={onJobSelect} />
        ))}
      </div>
    </div>
  );
};

export default JobPipeline;