export enum JobStatus {
  LEAD = 'LEAD',
  QUOTED = 'QUOTED',
  AWAITING_APPROVAL = 'AWAITING_APPROVAL',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  DELAYED = 'DELAYED',
  COMPLETED = 'COMPLETED',
  INVOICED = 'INVOICED',
  PAID = 'PAID',
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  category: 'chemical' | 'equipment';
  currentStock: number;
  threshold: number;
  unit: string;
}

export interface Tier {
  id: string;
  name: string;
  description: string;
  priceMultiplier: number;
  includes?: string[];
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  unitBased: boolean;
}

export interface Service {
  id: string;
  category: string;
  subCategory: string;
  name: string;
  description: string;
  unit: 'sq ft' | 'lf' | 'window' | 'hour' | 'item' | 'job';
  appliesTo: ('Residential' | 'Commercial')[];
  basePrice: number;
  tiers: Tier[];
  addOns: AddOn[];
  includes?: string[];
}

export interface QuoteItem {
  service: Service;
  quantity: number;
  tiers: Tier[];
  customerType: 'Residential' | 'Commercial';
  addOns: AddOn[];
  priceRange: {
    min: number;
    max: number;
  };
  notes?: string;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export interface ChemicalUsage {
    itemId: string;
    itemName: string;
    amountUsed: number;
}

export interface AIJobPlanStep {
    type: string;
    title: string;
    details: string;
    completed: boolean;
    ingredients?: {
        id: string;
        name: string;
        unit: string;
    }[];
    mixRatio?: string;
    ingredientUsage?: Record<string, number>;
}

export interface AIJobPlan {
    steps: AIJobPlanStep[];
}

export interface JobSheet {
    beforePhotos: string[];
    afterPhotos: string[];
    chemicalUsage: ChemicalUsage[];
    notes: string;
    aiJobPlan?: AIJobPlan;
}

export interface CustomerSelections {
  [serviceIndex: number]: {
    tierId: string;
    addOnIds: string[];
  };
}

export interface Job {
  id: string;
  customer: Customer;
  services: QuoteItem[];
  status: JobStatus;
  quoteTotalRange: { min: number; max: number };
  scheduledDate: Date;
  jobSheet: JobSheet;
  publicQuoteUrl?: string;
  customerSignature?: string;
  customerSelections?: CustomerSelections;
}

export type UserRole = 'ADMIN' | 'TECHNICIAN';

export interface CalendarEvent {
    title: string;
    start: Date | undefined;
    resource: Job;
}

// Props for components
export interface JobDetailsProps {
  job: Job;
  onBack: () => void;
  userRole: UserRole;
  updateJobStatus: (jobId: string, newStatus: JobStatus) => void;
  onSendQuote: (jobId: string) => void;
  onPreviewQuote: (job: Job) => void;
}

export interface PublicQuotePageProps {
  job: Job;
  onApproveQuote: (jobId: string, selections: CustomerSelections, signature: string, finalPrice: number) => void;
  isPreview?: boolean;
  onExitPreview?: () => void;
}
