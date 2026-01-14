export type Language = 'en' | 'hi'; // English or Hindi/Hinglish

export type UserRole = 'parent' | 'worker' | null;

export interface NutrientProfile {
  iron: number; // % of RDA
  zinc: number;
  vitaminA: number;
  calcium: number;
  protein: number;
}

export interface FoodItem {
  id: string;
  nameEn: string;
  nameHi: string;
  category: 'grain' | 'pulse' | 'veg' | 'fruit' | 'dairy' | 'animal' | 'nut_fat';
  icon: string; // Emoji or image URL
  nutrients: NutrientProfile; // Base value per standard serving
}

export interface ChildProfile {
  id: string;
  name: string;
  ageMonths: number;
  dateOfBirth: string; // ISO Date String
  gender: 'M' | 'F';
  riskLevel: 'low' | 'medium' | 'high'; // Green, Yellow, Red
  lastLogDate: string;
  streak: number;
  nutritionStatus: NutrientProfile;
  weightHistory: { month: number; weight: number }[]; // For growth chart
  location?: { lat: number; lng: number }; // For OpenLayers map
}

export interface LogEntry {
  foodId: string;
  quantity: number; // Multiplier of standard serving (e.g., 1 katori)
  unit: 'katori' | 'spoon' | 'glass' | 'piece';
  date?: string; // ISO Date string for history
}

export interface Alert {
  id: string;
  childId: string;
  childName: string;
  type: 'deficiency' | 'growth' | 'missing_data' | 'ebf_risk';
  severity: 'medium' | 'high' | 'critical';
  message: string;
  date: string;
}

export interface InventoryItem {
  id: string;
  nameEn: string;
  nameHi: string;
  quantity: number;
  unit: string;
  lowStockThreshold: number;
}

export type BadgeCategory = 'consistency' | 'nutrition' | 'community';

export interface Badge {
  id: string;
  category: BadgeCategory;
  nameEn: string;
  nameHi: string;
  icon: string;
  descriptionEn: string;
  unlocked: boolean;
  progress?: number; // 0 to 100
}

export interface Myth {
  id: string;
  category?: 'general' | 'ebf'; 
  mythEn: string;
  mythHi: string;
  factEn: string;
  factHi: string;
  rationaleEn: string;
  rationaleHi: string;
  icon: string;
}

export interface RecipeStep {
  textEn: string;
  textHi: string;
  image?: string; // Optional URL for visual guide
}

export interface Recipe {
  id: string;
  nameEn: string;
  nameHi: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  targetNutrients: (keyof NutrientProfile)[]; // Targets specific gaps
  prepTimeMinutes: number;
  cost: 'low' | 'medium' | 'high';
  ingredientsEn: string[];
  ingredientsHi: string[];
  steps: RecipeStep[];
  nutritionBreakdown: NutrientProfile; // What this meal provides
  icon: string;
}

export type RewardType = 'material' | 'digital';

export interface Reward {
  id: string;
  type: RewardType;
  threshold: number; // Days required
  nameEn: string;
  nameHi: string;
  descriptionEn: string;
  descriptionHi: string;
  icon: string;
}

export interface DailyStats {
  date: string;
  nutrients: NutrientProfile;
  score: 'good' | 'average' | 'poor'; // Derived from overall intake
  foodGroups: string[]; // Categories consumed
}

export interface RegionalStats {
  avgIron: number;
  avgProtein: number;
  avgVitaminA: number;
  percentile: number; // User is better than X%
  trend: 'up' | 'down' | 'stable';
  avgDDS: number; // Dietary Diversity Score (out of 7)
  stuntingRate: number; // District average %
  wastingRate: number; // District average %
}

// EBF Specific Types
export interface EbfTip {
  weekStart: number;
  weekEnd: number;
  actionEn: string;
  actionHi: string;
  icon: string;
}

export interface EbfCheckInQuestion {
  id: string;
  questionEn: string;
  questionHi: string;
  riskAnswer: boolean; // if true, it's a risk
  riskMessageEn: string;
  riskMessageHi: string;
}

export interface MarketAlternative {
  nameEn: string;
  nameHi: string;
  benefitEn: string;
  benefitHi: string;
  saving: string;
  icon: string;
}

export interface MarketAlertData {
  itemEn: string;
  itemHi: string;
  priceChange: string;
  trend: 'up' | 'down';
  reasonEn: string;
  reasonHi: string;
  impactEn: string;
  impactHi: string;
  alternatives: MarketAlternative[];
}

export interface SafetyStep {
  id: string;
  stepEn: string;
  stepHi: string;
  riskEn: string;
  riskHi: string;
  icon: string;
}