
import { Job, InventoryItem, Service, JobStatus, Tier, AddOn, QuoteItem } from './types';

// INVENTORY
export const INITIAL_INVENTORY: InventoryItem[] = [
  // Chemicals
  { id: 'chem-sh-12', name: 'Sodium Hypochlorite 12.5%', description: 'Bleach for house washing and concrete.', category: 'chemical', currentStock: 50, threshold: 10, unit: 'gallons' },
  { id: 'chem-eco-surf', name: 'Eco Surfactant', description: 'Eco-friendly soap for better cleaning.', category: 'chemical', currentStock: 5, threshold: 2, unit: 'gallons' },
  { id: 'chem-degreaser', name: 'Heavy Duty Degreaser', description: 'For oil stains on driveways.', category: 'chemical', currentStock: 2, threshold: 1, unit: 'gallons' },
  { id: 'chem-rust-remover', name: 'Rust Remover', description: 'For rust stains on concrete.', category: 'chemical', currentStock: 1, threshold: 0.5, unit: 'gallons' },
  { id: 'chem-wood-brightener', name: 'Wood Brightener', description: 'Neutralizes and brightens wood.', category: 'chemical', currentStock: 3, threshold: 1, unit: 'gallons' },
  { id: 'chem-wood-cleaner', name: 'Eco Wood Cleaner', description: 'Gentle cleaner for wood surfaces.', category: 'chemical', currentStock: 3, threshold: 1, unit: 'gallons' },
  { id: 'chem-coating-safe-cleaner', name: 'Coating-Safe Cleaner', description: 'For painted/sealed surfaces.', category: 'chemical', currentStock: 2, threshold: 1, unit: 'gallons' },
  
  // Equipment
  { id: 'equip-pw-4gpm', name: '4GPM Pressure Washer', description: 'Main pressure washing unit.', category: 'equipment', currentStock: 1, threshold: 1, unit: 'unit' },
  { id: 'equip-surface-cleaner', name: '20" Surface Cleaner', description: 'For cleaning large flat surfaces like driveways.', category: 'equipment', currentStock: 1, threshold: 1, unit: 'unit' },
  { id: 'equip-hose-200ft', name: '200ft Pressure Hose', description: 'High-pressure hose.', category: 'equipment', currentStock: 1, threshold: 1, unit: 'unit' },
  { id: 'equip-ladder-24ft', name: '24ft Extension Ladder', description: 'For reaching high areas.', category: 'equipment', currentStock: 1, threshold: 1, unit: 'unit' },
  { id: 'equip-wands', name: 'Wands and Nozzles Kit', description: 'Various wands and nozzles.', category: 'equipment', currentStock: 1, threshold: 1, unit: 'unit' },
];

// Tiers & AddOns Definitions
const soilTiers: Tier[] = [
    { id: 'tier-std', name: 'Standard', description: 'Light soil & mildew', priceMultiplier: 1.0 },
    { id: 'tier-bst', name: 'Boost', description: 'Moderate soil & growth', priceMultiplier: 1.15 },
    { id: 'tier-pro', name: 'Pro', description: 'Heavy soil, stains & neglect', priceMultiplier: 1.30 },
];
const plantGuardAddOn: AddOn = { id: 'addon-plantguard', name: 'SRS-PlantGuard', description: 'Protects landscaping from runoff.', price: 0.05, unitBased: true };
const shieldAddOn: AddOn = { id: 'addon-shield', name: 'SRS-Shield', description: 'Prevents mildew regrowth.', price: 0.05, unitBased: true };
const brightenAddOn: AddOn = { id: 'addon-brighten', name: 'SRW-Brighten', description: 'For rust/efflorescence.', price: 0.08, unitBased: true };
const woodBrightenAddOn: AddOn = { id: 'addon-wood-brighten', name: 'SRN-Wood Brighten', description: 'Restores color; acid neutralization.', price: 0.10, unitBased: true };
const gutterGuardAddon: AddOn = {id: 'addon-gutter-guard', name: 'With Guards (Add-On)', description: 'Remove / reinstall labor.', price: 0.35, unitBased: true};
const screenAddon: AddOn = {id: 'addon-screen', name: 'Screen Cleaning', description: 'Clean window screens.', price: 1.00, unitBased: false};
const trackAddon: AddOn = {id: 'addon-track', name: 'Track Detailing', description: 'Detail window tracks.', price: 1.50, unitBased: false};

// SERVICES
export const SERVICES: Service[] = [
  // --- Exterior Cleaning ---
  { id: 'svc-vinyl', category: 'Pressure & Soft Washing', subCategory: 'House / Siding', name: 'Vinyl Siding', description: 'Soft wash for vinyl siding.', unit: 'sq ft', appliesTo: ['Residential'], basePrice: 0.28, tiers: soilTiers, addOns: [plantGuardAddOn, shieldAddOn], includes: ['SRS-Exterior', 'SRN-Neutralize'] },
  { 
    id: 'svc-aluminum', 
    category: 'Pressure & Soft Washing', 
    subCategory: 'House / Siding', 
    name: 'Aluminum Siding', 
    description: 'Cleaning for aluminum siding.', 
    unit: 'sq ft', 
    appliesTo: ['Residential'], 
    basePrice: 0.37, // Base price is for Standard Oxidation
    tiers: [
      { id: 'tier-wash-only', name: 'Wash Only', description: 'Standard clean for light soil, no oxidation removal.', priceMultiplier: 0.81, includes: ['SRS-Exterior', 'SRN-Neutralize'] }, // price ~0.30
      { id: 'tier-std-ox', name: 'Standard', description: 'Light oxidation & soil removal.', priceMultiplier: 1.0 },
      { id: 'tier-bst-ox', name: 'Boost', description: 'Moderate oxidation & soil.', priceMultiplier: 1.16 }, // price ~0.43
      { id: 'tier-pro-ox', name: 'Pro', description: 'Heavy oxidation & neglect.', priceMultiplier: 1.35 }, // price ~0.50
    ],
    addOns: [plantGuardAddOn], 
    includes: ['SRW-Brighten', 'SRN-Neutralize'] 
  },
  { id: 'svc-wood-siding', category: 'Pressure & Soft Washing', subCategory: 'House / Siding', name: 'Painted Wood / T1-11', description: 'Gentle wash for painted wood.', unit: 'sq ft', appliesTo: ['Residential'], basePrice: 0.33, tiers: soilTiers, addOns: [plantGuardAddOn], includes: ['SRS-Exterior', 'SRN-Neutralize'] },
  { id: 'svc-brick', category: 'Pressure & Soft Washing', subCategory: 'House / Siding', name: 'Brick / Masonry', description: 'Cleaning for brick and masonry.', unit: 'sq ft', appliesTo: ['Residential', 'Commercial'], basePrice: 0.31, tiers: soilTiers, addOns: [shieldAddOn], includes: ['SRS-Exterior', 'SRN-Neutralize'] },
  { id: 'svc-stucco', category: 'Pressure & Soft Washing', subCategory: 'House / Siding', name: 'Stucco / EIFS', description: 'Soft wash for stucco surfaces.', unit: 'sq ft', appliesTo: ['Residential', 'Commercial'], basePrice: 0.35, tiers: soilTiers, addOns: [plantGuardAddOn], includes: ['SRS-Exterior', 'SRN-Neutralize'] },
  { id: 'svc-hardie', category: 'Pressure & Soft Washing', subCategory: 'House / Siding', name: 'Fiber Cement / Hardie', description: 'Cleaning for fiber cement siding.', unit: 'sq ft', appliesTo: ['Residential', 'Commercial'], basePrice: 0.31, tiers: soilTiers, addOns: [], includes: ['SRS-Exterior', 'SRN-Neutralize'] },

  // --- Roof Cleaning ---
  { id: 'svc-asphalt-roof', category: 'Pressure & Soft Washing', subCategory: 'Roof Cleaning', name: 'Asphalt Shingle', description: 'Soft wash for asphalt shingle roofs.', unit: 'sq ft', appliesTo: ['Residential'], basePrice: 0.38, tiers: soilTiers, addOns: [plantGuardAddOn], includes: ['SRS-Exterior', 'SRN-Neutralize'] },
  { id: 'svc-metal-roof', category: 'Pressure & Soft Washing', subCategory: 'Roof Cleaning', name: 'Metal Roof', description: 'Cleaning for metal roofs.', unit: 'sq ft', appliesTo: ['Residential', 'Commercial'], basePrice: 0.43, tiers: soilTiers, addOns: [plantGuardAddOn], includes: ['SRS-Exterior', 'SRN-Neutralize'] },
  { id: 'svc-tile-roof', category: 'Pressure & Soft Washing', subCategory: 'Roof Cleaning', name: 'Tile / Clay Roof', description: 'Soft wash for tile roofs.', unit: 'sq ft', appliesTo: ['Residential'], basePrice: 0.53, tiers: soilTiers, addOns: [plantGuardAddOn], includes: ['SRS-Exterior', 'SRN-Neutralize'] },
  { id: 'svc-cedar-roof', category: 'Pressure & Soft Washing', subCategory: 'Roof Cleaning', name: 'Cedar Shake / Wood Roof', description: 'Specialized cleaning for wood roofs.', unit: 'sq ft', appliesTo: ['Residential'], basePrice: 0.48, tiers: soilTiers, addOns: [shieldAddOn], includes: ['SRS-Wood', 'SRN-Wood'] },
  { id: 'svc-flat-roof', category: 'Pressure & Soft Washing', subCategory: 'Roof Cleaning', name: 'Flat / EPDM Roof', description: 'Cleaning for flat commercial roofs.', unit: 'sq ft', appliesTo: ['Commercial'], basePrice: 0.33, tiers: soilTiers, addOns: [], includes: ['SRS-Exterior', 'SRN-Neutralize'] },

  // --- Deck & Fence Cleaning ---
  { id: 'svc-pt-wood', category: 'Pressure & Soft Washing', subCategory: 'Deck & Fence Cleaning', name: 'Pressure-Treated Wood', description: 'Cleaning for PT wood decks/fences.', unit: 'sq ft', appliesTo: ['Residential'], basePrice: 0.28, tiers: soilTiers, addOns: [woodBrightenAddOn], includes: ['SRS-Wood', 'SRN-Neutralize'] },
  { id: 'svc-cedar-wood', category: 'Pressure & Soft Washing', subCategory: 'Deck & Fence Cleaning', name: 'Cedar / Redwood', description: 'Gentle cleaning for cedar/redwood.', unit: 'sq ft', appliesTo: ['Residential'], basePrice: 0.33, tiers: soilTiers, addOns: [woodBrightenAddOn], includes: ['SRS-Wood', 'SRN-Wood'] },
  { id: 'svc-composite', category: 'Pressure & Soft Washing', subCategory: 'Deck & Fence Cleaning', name: 'Composite Decking', description: 'Cleaning for composite materials.', unit: 'sq ft', appliesTo: ['Residential'], basePrice: 0.30, tiers: soilTiers, addOns: [], includes: ['SRS-Wood', 'SRN-Neutralize'] },
  { id: 'svc-painted-wood', category: 'Pressure & Soft Washing', subCategory: 'Deck & Fence Cleaning', name: 'Painted / Sealed Wood', description: 'Coating-safe gentle wash.', unit: 'sq ft', appliesTo: ['Residential'], basePrice: 0.33, tiers: [{id: 'tier-std-only', name: 'Standard', description: 'Gentle coating-safe formula', priceMultiplier: 1.0}], addOns: [], includes: ['SRS-Finish'] },
  { id: 'svc-vinyl-fence', category: 'Pressure & Soft Washing', subCategory: 'Deck & Fence Cleaning', name: 'Vinyl Fence', description: 'Softwash for vinyl fencing.', unit: 'sq ft', appliesTo: ['Residential'], basePrice: 0.25, tiers: soilTiers, addOns: [], includes: ['SRS-Exterior', 'SRN-Neutralize'] },

  // --- Concrete Cleaning ---
  { id: 'svc-broom-concrete', category: 'Pressure & Soft Washing', subCategory: 'Concrete / Paver Cleaning', name: 'Broom-Finish Concrete', description: 'Standard concrete driveway/patio cleaning.', unit: 'sq ft', appliesTo: ['Residential', 'Commercial'], basePrice: 0.20, tiers: soilTiers, addOns: [brightenAddOn], includes: ['SRP-Concrete', 'SRN-Neutralize'] },
  { id: 'svc-dec-concrete', category: 'Pressure & Soft Washing', subCategory: 'Concrete / Paver Cleaning', name: 'Decorative Concrete', description: 'Gentle cleaning for stamped/decorative concrete.', unit: 'sq ft', appliesTo: ['Residential', 'Commercial'], basePrice: 0.25, tiers: soilTiers, addOns: [], includes: ['SRP-Concrete', 'SRN-Neutralize'] },
  { id: 'svc-brick-pavers', category: 'Pressure & Soft Washing', subCategory: 'Concrete / Paver Cleaning', name: 'Brick / Clay Pavers', description: 'Cleaning for brick/clay pavers.', unit: 'sq ft', appliesTo: ['Residential', 'Commercial'], basePrice: 0.26, tiers: soilTiers, addOns: [], includes: ['SRP-Concrete', 'SRN-Neutralize'] },
  { id: 'svc-garage', category: 'Pressure & Soft Washing', subCategory: 'Concrete / Paver Cleaning', name: 'Garage / Shop Floors', description: 'Interior concrete floor cleaning.', unit: 'sq ft', appliesTo: ['Commercial'], basePrice: 0.28, tiers: soilTiers, addOns: [], includes: ['SRP-Concrete', 'SRN-Neutralize'] },

  // --- Gutter & Window ---
  { id: 'svc-gutter-ext', category: 'Pressure & Soft Washing', subCategory: 'Gutter & Window Cleaning', name: 'Gutter Exterior Brightening', description: 'Exterior brightening of gutters.', unit: 'lf', appliesTo: ['Residential', 'Commercial'], basePrice: 1.40, tiers: [], addOns: [gutterGuardAddon], includes: ['SRW-Brighten', 'SRN-Neutralize'] },
  { id: 'svc-gutter-full', category: 'Pressure & Soft Washing', subCategory: 'Gutter & Window Cleaning', name: 'Gutter Inside & Out', description: 'Debris removal and exterior brightening.', unit: 'lf', appliesTo: ['Residential', 'Commercial'], basePrice: 1.60, tiers: [], addOns: [gutterGuardAddon], includes: ['SRW-Brighten', 'SRN-Neutralize'] },
  { id: 'svc-window-ext-1', category: 'Pressure & Soft Washing', subCategory: 'Gutter & Window Cleaning', name: 'Window Cleaning (Ext, 1st Story)', description: 'Exterior window cleaning, ground level.', unit: 'window', appliesTo: ['Residential', 'Commercial'], basePrice: 5.00, tiers: [], addOns: [screenAddon, trackAddon], includes: [] },
  { id: 'svc-window-ext-2', category: 'Pressure & Soft Washing', subCategory: 'Gutter & Window Cleaning', name: 'Window Cleaning (Ext, 2nd Story)', description: 'Exterior window cleaning, second level.', unit: 'window', appliesTo: ['Residential', 'Commercial'], basePrice: 6.50, tiers: [], addOns: [screenAddon], includes: [] },
  { id: 'svc-window-int-ext-1', category: 'Pressure & Soft Washing', subCategory: 'Gutter & Window Cleaning', name: 'Window Cleaning (Int/Ext, 1st Story)', description: 'Full window cleaning, ground level.', unit: 'window', appliesTo: ['Residential'], basePrice: 8.00, tiers: [], addOns: [trackAddon], includes: [] },

  // --- Other Categories ---
  { id: 'svc-drywall', category: 'Handyman & Light Carpentry', subCategory: 'Repairs', name: 'Minor Drywall Repair', description: 'Patching small holes and cracks.', unit: 'hour', appliesTo: ['Residential', 'Commercial'], basePrice: 65, tiers: [], addOns: [], includes: [] },
  { id: 'svc-furniture-assembly', category: 'Furniture Assembly', subCategory: 'Assembly', name: 'Standard Item Assembly', description: 'Assembly of flat-pack furniture.', unit: 'item', appliesTo: ['Residential'], basePrice: 80, tiers: [], addOns: [], includes: [] },
  { id: 'svc-yard-cleanup', category: 'Property Maintenance', subCategory: 'Cleanup', name: 'Yard Debris Cleanup', description: 'Removal of leaves, branches, etc.', unit: 'hour', appliesTo: ['Residential', 'Commercial'], basePrice: 55, tiers: [], addOns: [], includes: [] },
  { id: 'svc-oil-change', category: 'Mobile Mechanic', subCategory: 'Maintenance', name: 'Standard Oil Change', description: 'Mobile oil and filter change.', unit: 'job', appliesTo: ['Residential', 'Commercial'], basePrice: 90, tiers: [], addOns: [], includes: [] },
];

// FORMULAS
export const FORMULA_INGREDIENTS: Record<string, string[]> = {
    'SRS-Exterior': ['chem-sh-12', 'chem-eco-surf'],
    'SRN-Neutralize': [], // Typically water, no inventory item
    'SRW-Brighten': ['chem-rust-remover'], // Generic brightener
    'SRS-Wood': ['chem-wood-cleaner'],
    'SRN-Wood': ['chem-wood-brightener'],
    'SRS-Finish': ['chem-coating-safe-cleaner'],
    'SRP-Concrete': ['chem-sh-12', 'chem-degreaser'],
    'SRN-Wood Brighten': ['chem-wood-brightener'],
    'SRS-PlantGuard': [],
    'SRS-Shield': [],
};

// EQUIPMENT MAPPING
export const SERVICE_EQUIPMENT_MAP: Record<string, string[]> = {
    'base': ['equip-pw-4gpm', 'equip-hose-200ft', 'equip-wands'],
    'Pressure & Soft Washing': ['equip-ladder-24ft'], // General category equipment
    'svc-broom-concrete': ['equip-surface-cleaner'],
    'svc-dec-concrete': ['equip-surface-cleaner'],
    'svc-brick-pavers': ['equip-surface-cleaner'],
    'svc-garage': ['equip-surface-cleaner'],
};

// INITIAL JOBS
const createQuoteItem = (
    serviceId: string, 
    quantity: number, 
    tierIds: string[],
    customerType: 'Residential' | 'Commercial'
): QuoteItem => {
    const service = SERVICES.find(s => s.id === serviceId)!;
    const tiers = service.tiers.filter(t => tierIds.includes(t.id));
    
    const minTierMultiplier = tiers.length > 0 ? Math.min(...tiers.map(t => t.priceMultiplier)) : 1;
    const maxTierMultiplier = tiers.length > 0 ? Math.max(...tiers.map(t => t.priceMultiplier)) : 1;

    return {
        service,
        quantity,
        tiers,
        customerType,
        addOns: [],
        priceRange: { 
            min: service.basePrice * quantity * minTierMultiplier, 
            max: service.basePrice * quantity * maxTierMultiplier 
        }
    }
};

export const INITIAL_JOBS: Job[] = [
  {
    id: 'SR-1001',
    customer: { id: 'cust-1', name: 'John Smith', email: 'john@example.com', phone: '555-1234', address: '123 Oak St, Pleasantville' },
    services: [
        createQuoteItem('svc-vinyl', 1800, ['tier-std'], 'Residential')
    ],
    status: JobStatus.SCHEDULED,
    quoteTotalRange: { min: 504, max: 504 },
    scheduledDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    jobSheet: { beforePhotos: [], afterPhotos: [], chemicalUsage: [], notes: '' },
  },
  {
    id: 'SR-1002',
    customer: { id: 'cust-2', name: 'Jane Doe', email: 'jane@example.com', phone: '555-5678', address: '456 Maple Ave, Springfield' },
    services: [
        createQuoteItem('svc-broom-concrete', 800, ['tier-std', 'tier-bst', 'tier-pro'], 'Residential')
    ],
    status: JobStatus.IN_PROGRESS,
    quoteTotalRange: { min: 160, max: 208 },
    scheduledDate: new Date(),
    jobSheet: { beforePhotos: [], afterPhotos: [], chemicalUsage: [], notes: 'Customer has a dog, be careful with the gate.' },
  },
];