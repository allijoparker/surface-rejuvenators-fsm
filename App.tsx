import React, { useState, useMemo } from 'react';
import { Job, InventoryItem, UserRole, JobStatus, CustomerSelections } from './types';
import { INITIAL_JOBS, INITIAL_INVENTORY, SERVICES } from './constants';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './components/Dashboard';
import JobPipeline from './components/JobPipeline';
import InventoryPage from './components/InventoryPage';
import TechnicianView from './components/TechnicianView';
import QuoteTool from './components/QuoteTool';
import JobDetails from './components/JobDetails';
import TechnicianJobFlow from './components/technician/TechnicianJobFlow';
import PublicQuotePage from './components/PublicQuotePage';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [userRole, setUserRole] = useState<UserRole>('ADMIN');
  const [activeView, setActiveView] = useState('DASHBOARD');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [previewJob, setPreviewJob] = useState<Job | null>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const publicQuoteId = urlParams.get('quoteId');
  const jobForPublicQuote = jobs.find(job => job.id === publicQuoteId);

  const lowStockItems = useMemo(() => {
    return inventory.filter(item => item.currentStock < item.threshold);
  }, [inventory]);

  const handleSaveQuote = (newJobData: Omit<Job, 'id'>) => {
    const newJob: Job = {
      ...newJobData,
      id: `SR-${1003 + jobs.length}`,
    };
    setJobs(prev => [...prev, newJob]);
    setSelectedJob(newJob);
    setActiveView('JOB_DETAILS');
  };

  const updateJobStatus = (jobId: string, newStatus: JobStatus) => {
    setJobs(prevJobs => prevJobs.map(job =>
      job.id === jobId ? { ...job, status: newStatus } : job
    ));
    if (selectedJob && selectedJob.id === jobId) {
      setSelectedJob(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };
  
  const updateJob = (updatedJob: Job) => {
     setJobs(prevJobs => prevJobs.map(job =>
      job.id === updatedJob.id ? updatedJob : job
    ));
    if (selectedJob && selectedJob.id === updatedJob.id) {
        setSelectedJob(updatedJob);
    }
  };
  
  const updateInventory = (itemId: string, amountUsed: number) => {
      setInventory(prevInventory => prevInventory.map(item => 
          item.id === itemId ? {...item, currentStock: item.currentStock - amountUsed} : item
      ));
  };

  const handleSendQuote = (jobId: string) => {
    const jobUrl = `${window.location.origin}${window.location.pathname}?quoteId=${jobId}`;
    const updatedJob = jobs.find(job => job.id === jobId);
    if (updatedJob) {
      const newJob = { ...updatedJob, status: JobStatus.AWAITING_APPROVAL, publicQuoteUrl: jobUrl };
      updateJob(newJob);
    }
  };
  
  const handlePreviewQuote = (job: Job) => {
      setPreviewJob(job);
  }
  
  const handleExitPreview = () => {
      setPreviewJob(null);
  }

  const handleApproveQuote = (jobId: string, selections: CustomerSelections, signature: string, finalPrice: number) => {
    setJobs(prevJobs => prevJobs.map(job =>
      job.id === jobId ? { 
          ...job, 
          status: JobStatus.SCHEDULED, 
          customerSelections: selections,
          customerSignature: signature,
          quoteTotalRange: { min: finalPrice, max: finalPrice }
      } : job
    ));
    alert('Quote approved! You will be redirected back to the main app.');
    setTimeout(() => {
        window.location.href = `${window.location.origin}${window.location.pathname}`;
    }, 2000);
  };

  const renderAdminView = () => {
    if ((selectedJob && activeView === 'JOB_DETAILS') || (selectedJob && !activeView)) {
      return <JobDetails 
        job={selectedJob} 
        onBack={() => { setSelectedJob(null); setActiveView('JOBS'); }} 
        userRole={userRole} 
        updateJobStatus={updateJobStatus}
        onSendQuote={handleSendQuote}
        onPreviewQuote={handlePreviewQuote}
      />;
    }
    
    switch (activeView) {
      case 'DASHBOARD':
        return <Dashboard jobs={jobs} lowStockItems={lowStockItems} onNewQuote={() => setActiveView('NEW_QUOTE')} onJobSelect={(job) => { setSelectedJob(job); setActiveView('JOB_DETAILS'); }} />;
      case 'JOBS':
        return <JobPipeline jobs={jobs} setJobs={setJobs} onJobSelect={(job) => { setSelectedJob(job); setActiveView('JOB_DETAILS'); }} />;
      case 'INVENTORY':
        return <InventoryPage inventory={inventory} setInventory={setInventory} />;
      case 'NEW_QUOTE':
        return <QuoteTool services={SERVICES} onSaveQuote={handleSaveQuote} onCancel={() => setActiveView('DASHBOARD')} />;
      default:
        return <Dashboard jobs={jobs} lowStockItems={lowStockItems} onNewQuote={() => setActiveView('NEW_QUOTE')} onJobSelect={(job) => { setSelectedJob(job); setActiveView('JOB_DETAILS'); }} />;
    }
  };
  
  const renderTechnicianView = () => {
    if (selectedJob && userRole === 'TECHNICIAN') {
      return <TechnicianJobFlow 
        job={selectedJob} 
        onExit={() => setSelectedJob(null)} 
        onUpdateJob={updateJob}
        onUpdateJobStatus={updateJobStatus}
        onUpdateInventory={updateInventory}
      />
    }
    return <TechnicianView jobs={jobs} onJobSelect={setSelectedJob} />;
  }
  
  if (previewJob) {
      return (
          <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
              <PublicQuotePage job={previewJob} onApproveQuote={handleApproveQuote} isPreview={true} onExitPreview={handleExitPreview} />
          </div>
      )
  }
  
  if (jobForPublicQuote) {
      return (
          <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
              <PublicQuotePage job={jobForPublicQuote} onApproveQuote={handleApproveQuote} />
          </div>
      );
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar userRole={userRole} activeView={activeView} setActiveView={setActiveView} setSelectedJob={setSelectedJob} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userRole={userRole} setUserRole={setUserRole} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {userRole === 'ADMIN' ? renderAdminView() : renderTechnicianView()}
        </main>
      </div>
    </div>
  );
};

export default App;
