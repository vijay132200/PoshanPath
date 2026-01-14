import { FoodItem, ChildProfile, Alert, InventoryItem, Badge, Myth, Recipe, Reward, DailyStats, RegionalStats, EbfTip, EbfCheckInQuestion, MarketAlertData, SafetyStep } from './types';

export const TRANSLATIONS = {
  en: {
    welcome: "Welcome to PoshanPath",
    selectRole: "Who are you?",
    parent: "Parent / Mother",
    worker: "Anganwadi Worker",
    logFood: "Log Today's Food",
    streak: "Day Streak",
    myChild: "My Child's Health",
    riskMap: "Catchment Area Risk",
    alerts: "Priority Alerts",
    askDidi: "Ask Poshan Didi",
    save: "Save",
    add: "Add",
    selectUnit: "How much?",
    katori: "Bowl (Katori)",
    spoon: "Spoon",
    glass: "Glass",
    piece: "Piece",
    submit: "Submit Log",
    chatPlaceholder: "Ask about food, health...",
    dashboard: "Dashboard",
    children: "Children",
    inventory: "Inventory",
    growthChart: "Growth Chart",
    weight: "Weight (kg)",
    age: "Age (months)",
    community: "Community Board",
    badges: "Achievements",
    lowStock: "Low Stock",
    distribute: "Distribute",
    recordVisit: "Record Visit",
    listening: "Listening...",
    mythBusters: "Myth Busters",
    myth: "Common Myth",
    fact: "Scientific Fact",
    revealTruth: "Reveal Truth",
    hideTruth: "Hide Truth",
    recommendations: "Feeding Guide",
    recommendationSubtitle: "Recipes for today's needs",
    mins: "mins",
    ingredients: "Ingredients",
    rewards: "Rewards Center",
    daysToNext: "days to next reward",
    claim: "Claim",
    redeem: "Redeem at Center",
    viewQr: "View QR Code",
    shareCommunity: "Share with Community",
    shared: "Shared!",
    scanInstruction: "Show this QR code to the Anganwadi Worker to claim your kit.",
    digitalReward: "Digital Honor",
    materialReward: "Physical Kit",
    progress: "Your Progress",
    locked: "Locked",
    stats: "Health Stats",
    trends: "Nutrient Trends",
    diversity: "Dietary Diversity",
    calendar: "Monthly Health Calendar",
    regional: "Regional Comparison",
    goodDay: "Good Day",
    avgDay: "Average",
    poorDay: "Needs Impr.",
    foodGroups: "Food Groups Eaten",
    regionalMsg: "Your child is doing better than",
    similarChildren: "of children in your district!",
    ironTrend: "Iron Levels",
    proteinTrend: "Protein Levels",
    target: "Target",
    thisWeek: "Last 7 Days",
    monthView: "30 Day View",
    whoStandard: "WHO/IAP Standard",
    childIntake: "Child's Intake",
    balanceScore: "Nutrient Balance",
    growthMetrics: "Growth Metrics",
    stunting: "Height Growth",
    wasting: "Weight Health",
    districtAvg: "District Avg",
    betterThan: "Better",
    needsAttn: "Needs Care",
    consistency: "Consistency",
    nutrition: "Nutrition",
    badgeLocked: "Locked",
    badgeUnlocked: "Unlocked",
    optInTitle: "Community Recognition",
    optInDesc: "Allow my name on the Anganwadi board?",
    optInSuccess: "You are now visible on the Leaderboard!",
    streakTitle: "Streak Progress",
    materialTitle: "Material Rewards",
    socialTitle: "Hall of Fame",
    milestoneReached: "Milestone Reached!",
    meals: "Meals",
    cost: "Cost",
    prep: "Prep",
    cookThis: "I Cooked This!",
    cookingInstructions: "Cooking Instructions",
    nutrientBoost: "Nutrient Boost",
    ageSuitability: "Age Suitability",
    recipeGenerated: "Recipe curated for",
    coach: "EBF Coach",
    week: "Week",
    babyAge: "Baby's Age",
    checkInTitle: "Quick Check-In",
    checkInDesc: "Answer 3 simple questions to ensure baby is healthy.",
    yes: "Yes",
    no: "No",
    allGood: "Great Job, Mom!",
    allGoodDesc: "Your breastfeeding journey is going perfectly. Keep it up!",
    riskDetected: "Let's Check This",
    riskDetectedDesc: "We noticed something that might need attention. We have alerted your Anganwadi Didi.",
    contactWorker: "Contact Didi",
    voiceMessage: "Voice Msg",
    call: "Call",
    seasonalAlert: "Market Watch",
    smartSwaps: "Smart Swaps",
    faoSource: "Source: FAO Crop Calendar",
    bottleSafety: "Bottle Safety Checklist",
    risk: "Risk"
  },
  hi: {
    welcome: "पोषण पथ में आपका स्वागत है",
    selectRole: "आप कौन हैं?",
    parent: "माता / पिता",
    worker: "आंगनवाड़ी कार्यकर्ता",
    logFood: "आज का खाना जोड़ें",
    streak: "लगातार दिन",
    myChild: "बच्चे का स्वास्थ्य",
    riskMap: "क्षेत्र का नक्शा",
    alerts: "जरूरी सूचनाएं",
    askDidi: "पोषण दीदी से पूछें",
    save: "सहेजें",
    add: "जोड़ें",
    selectUnit: "कितनी मात्रा?",
    katori: "कटोरी",
    spoon: "चम्मच",
    glass: "ग्लास",
    piece: "टुकड़ा",
    submit: "जमा करें",
    chatPlaceholder: "खाने या सेहत के बारे में पूछें...",
    dashboard: "डैशबोर्ड",
    children: "बच्चे",
    inventory: "भंडार",
    growthChart: "विकास चार्ट",
    weight: "वजन (किग्रा)",
    age: "उम्र (महीने)",
    community: "समुदाय बोर्ड",
    badges: "उपलब्धियां",
    lowStock: "कम स्टॉक",
    distribute: "वितरण करें",
    recordVisit: "मुलाकात दर्ज करें",
    listening: "सुन रहे हैं...",
    mythBusters: "पोषण सच",
    myth: "आम धारणा",
    fact: "वैज्ञानिक सच",
    revealTruth: "सच देखें",
    hideTruth: "छिपाएं",
    recommendations: "आहार गाइड",
    recommendationSubtitle: "आज की जरूरत के अनुसार",
    mins: "मिनट",
    ingredients: "सामग्री",
    rewards: "इनाम केंद्र",
    daysToNext: "दिन अगले इनाम तक",
    claim: "प्राप्त करें",
    redeem: "केंद्र पर लें",
    viewQr: "QR कोड देखें",
    shareCommunity: "समुदाय में साझा करें",
    shared: "साझा किया!",
    scanInstruction: "अपना किट लेने के लिए आंगनवाड़ी कार्यकर्ता को यह QR कोड दिखाएं।",
    digitalReward: "सम्मान (डिजिटल)",
    materialReward: "राशन किट",
    progress: "आपकी प्रगति",
    locked: "लॉक है",
    stats: "स्वास्थ्य रिपोर्ट",
    trends: "पोषण ग्राफ",
    diversity: "खाने की विविधता",
    calendar: "मासिक स्वास्थ्य कैलेंडर",
    regional: "क्षेत्रीय तुलना",
    goodDay: "अच्छा दिन",
    avgDay: "औसत",
    poorDay: "सुधार चाहिए",
    foodGroups: "खाए गए आहार समूह",
    regionalMsg: "आपका बच्चा",
    similarChildren: "बच्चों से बेहतर कर रहा है!",
    ironTrend: "आयरन स्तर",
    proteinTrend: "प्रोटीन स्तर",
    target: "लक्ष्य",
    thisWeek: "पिछले 7 दिन",
    monthView: "30 दिन",
    whoStandard: "WHO/IAP मानक",
    childIntake: "बच्चे का आहार",
    balanceScore: "संतुलन स्कोर",
    growthMetrics: "विकास रिपोर्ट",
    stunting: "लंबाई वृद्धि",
    wasting: "वजन स्वास्थ्य",
    districtAvg: "ज़िला औसत",
    betterThan: "बेहतर",
    needsAttn: "ध्यान दें",
    consistency: "नियमितता",
    nutrition: "पोषण",
    badgeLocked: "लॉक है",
    badgeUnlocked: "अनलॉक है",
    optInTitle: "सामुदायिक सम्मान",
    optInDesc: "आंगनवाड़ी बोर्ड पर मेरा नाम दिखाएं?",
    optInSuccess: "अब आप लीडरबोर्ड पर दिखाई दे रहे हैं!",
    streakTitle: "लगातार प्रगति",
    materialTitle: "राशन इनाम",
    socialTitle: "सम्मान बोर्ड",
    milestoneReached: "मील का पत्थर हासिल!",
    meals: "भोजन",
    cost: "लागत",
    prep: "समय",
    cookThis: "मैंने यह बनाया!",
    cookingInstructions: "बनाने की विधि",
    nutrientBoost: "पोषण लाभ",
    ageSuitability: "आयु उपयुक्तता",
    recipeGenerated: "सुझाया गया भोजन",
    coach: "स्तनपान साथी",
    week: "सप्ताह",
    babyAge: "बच्चे की उम्र",
    checkInTitle: "क्विक चेक-इन",
    checkInDesc: "बच्चे की सेहत के लिए 3 आसान सवालों के जवाब दें।",
    yes: "हाँ",
    no: "नहीं",
    allGood: "बहुत बढ़िया, माँ!",
    allGoodDesc: "आपका स्तनपान का सफर बिल्कुल सही चल रहा है।",
    riskDetected: "ध्यान दें",
    riskDetectedDesc: "कुछ चीजों पर ध्यान देने की जरूरत है। हमने आंगनवाड़ी दीदी को सूचित कर दिया है।",
    contactWorker: "दीदी से बात करें",
    voiceMessage: "आवाज़ संदेश",
    call: "कॉल करें",
    seasonalAlert: "बाजार अपडेट",
    smartSwaps: "सस्ते और अच्छे विकल्प",
    faoSource: "स्रोत: FAO फसल कैलेंडर",
    bottleSafety: "बोतल सुरक्षा सूची",
    risk: "जोखिम"
  }
};

export const getWhoStandard = (gender: 'M' | 'F', month: number) => {
  const base = gender === 'M' ? 3.3 : 3.2;
  const multiplier = gender === 'M' ? 2.8 : 2.6; 
  return parseFloat((base + Math.log(month + 1) * multiplier).toFixed(1));
};

export const FOOD_DB: FoodItem[] = [
  { id: '1', nameEn: 'Roti', nameHi: 'रोटी', category: 'grain', icon: '🫓', nutrients: { iron: 5, zinc: 4, vitaminA: 0, calcium: 2, protein: 8 } },
  { id: '2', nameEn: 'Rice', nameHi: 'चावल', category: 'grain', icon: '🍚', nutrients: { iron: 2, zinc: 2, vitaminA: 0, calcium: 1, protein: 5 } },
  { id: '3', nameEn: 'Dal (Lentils)', nameHi: 'दाल', category: 'pulse', icon: '🍲', nutrients: { iron: 15, zinc: 10, vitaminA: 2, calcium: 4, protein: 18 } },
  { id: '4', nameEn: 'Spinach (Saag)', nameHi: 'साग / पालक', category: 'veg', icon: '🥬', nutrients: { iron: 25, zinc: 5, vitaminA: 60, calcium: 15, protein: 5 } },
  { id: '5', nameEn: 'Milk', nameHi: 'दूध', category: 'dairy', icon: '🥛', nutrients: { iron: 1, zinc: 8, vitaminA: 10, calcium: 30, protein: 12 } },
  { id: '6', nameEn: 'Egg', nameHi: 'अंडा', category: 'animal', icon: '🥚', nutrients: { iron: 12, zinc: 15, vitaminA: 15, calcium: 5, protein: 20 } },
  { id: '7', nameEn: 'Banana', nameHi: 'केला', category: 'fruit', icon: '🍌', nutrients: { iron: 2, zinc: 1, vitaminA: 2, calcium: 2, protein: 3 } },
  { id: '8', nameEn: 'Papaya', nameHi: 'पपीता', category: 'fruit', icon: '🥭', nutrients: { iron: 2, zinc: 1, vitaminA: 40, calcium: 4, protein: 2 } },
  { id: '9', nameEn: 'Peanuts', nameHi: 'मूंगफली', category: 'nut_fat', icon: '🥜', nutrients: { iron: 8, zinc: 10, vitaminA: 0, calcium: 5, protein: 15 } },
  { id: '10', nameEn: 'Ghee', nameHi: 'घी', category: 'nut_fat', icon: '🧈', nutrients: { iron: 0, zinc: 0, vitaminA: 20, calcium: 0, protein: 0 } },
];

export const RECIPE_DB: Recipe[] = [
  {
    id: 'r1',
    nameEn: 'Mashed Dal & Spinach',
    nameHi: 'दाल और पालक का मैश',
    minAgeMonths: 6,
    maxAgeMonths: 8,
    targetNutrients: ['iron', 'protein'],
    prepTimeMinutes: 15,
    cost: 'low',
    ingredientsEn: ['2 tbsp Yellow Moong Dal', '5-6 Spinach leaves', '1 tsp Ghee', 'Pinch of Turmeric'],
    ingredientsHi: ['2 बड़े चम्मच मूंग दाल', '5-6 पालक के पत्ते', '1 चम्मच घी', 'चुटकी भर हल्दी'],
    steps: [
      { textEn: 'Wash dal and spinach thoroughly.', textHi: 'दाल और पालक को अच्छे से धो लें।' },
      { textEn: 'Pressure cook with little water and turmeric for 3 whistles.', textHi: 'थोड़े पानी और हल्दी के साथ 3 सीटी तक पकाएं।' },
      { textEn: 'Mash nicely with a spoon. Add ghee before serving.', textHi: 'चम्मच से अच्छे से मैश करें। परोसने से पहले घी डालें।' }
    ],
    nutritionBreakdown: { iron: 30, zinc: 10, vitaminA: 40, calcium: 10, protein: 25 },
    icon: '🥣'
  },
  {
    id: 'r2',
    nameEn: 'Ragi & Banana Porridge',
    nameHi: 'रागी और केले की खीर',
    minAgeMonths: 6,
    maxAgeMonths: 24,
    targetNutrients: ['calcium', 'iron'],
    prepTimeMinutes: 10,
    cost: 'low',
    ingredientsEn: ['2 tbsp Ragi Flour', '1/2 Ripe Banana', '1/2 cup Milk/Water', 'Jaggery (optional)'],
    ingredientsHi: ['2 बड़े चम्मच रागी का आटा', '1/2 पका केला', '1/2 कप दूध/पानी', 'गुड़ (वैकल्पिक)'],
    steps: [
      { textEn: 'Mix ragi flour with water to remove lumps.', textHi: 'रागी के आटे को पानी में घोलें ताकि गांठ न पड़े।' },
      { textEn: 'Cook on low flame until thick and shiny.', textHi: 'धीमी आंच पर गाढ़ा और चमकदार होने तक पकाएं।' },
      { textEn: 'Mash banana and mix into the porridge.', textHi: 'केले को मसलकर खीर में मिलाएं।' }
    ],
    nutritionBreakdown: { iron: 20, zinc: 5, vitaminA: 5, calcium: 60, protein: 10 },
    icon: '🥛'
  },
  {
    id: 'r3',
    nameEn: 'Khichdi with Veggies',
    nameHi: 'सब्जियों वाली खिचड़ी',
    minAgeMonths: 9,
    maxAgeMonths: 59,
    targetNutrients: ['protein', 'vitaminA'],
    prepTimeMinutes: 20,
    cost: 'medium',
    ingredientsEn: ['Rice', 'Masoor Dal', 'Carrot/Pumpkin', 'Ghee'],
    ingredientsHi: ['चावल', 'मसूर दाल', 'गाजर/कद्दू', 'घी'],
    steps: [
      { textEn: 'Finely chop carrots or pumpkin.', textHi: 'गाजर या कद्दू को बारीक काट लें।' },
      { textEn: 'Cook rice, dal, and veggies together until very soft.', textHi: 'चावल, दाल और सब्जियों को बहुत नरम होने तक पकाएं।' },
      { textEn: 'Lightly mash for younger kids, serve as is for older ones.', textHi: 'छोटे बच्चों के लिए हल्का मैश करें, बड़ों को ऐसे ही दें।' }
    ],
    nutritionBreakdown: { iron: 15, zinc: 15, vitaminA: 50, calcium: 10, protein: 30 },
    icon: '🍲'
  },
  {
    id: 'r4',
    nameEn: 'Egg & Potato Mash',
    nameHi: 'अंडा और आलू मैश',
    minAgeMonths: 9,
    maxAgeMonths: 59,
    targetNutrients: ['protein', 'zinc', 'vitaminA'],
    prepTimeMinutes: 15,
    cost: 'medium',
    ingredientsEn: ['1 Boiled Egg', '1 Small Boiled Potato', 'Black Pepper', 'Butter/Oil'],
    ingredientsHi: ['1 उबला अंडा', '1 छोटा उबला आलू', 'काली मिर्च', 'मक्खन/तेल'],
    steps: [
      { textEn: 'Mash the boiled potato and egg yolk (add white if child can chew).', textHi: 'उबले आलू और अंडे की जर्दी को मैश करें।' },
      { textEn: 'Add a pinch of pepper and butter.', textHi: 'चुटकी भर काली मिर्च और मक्खन डालें।' }
    ],
    nutritionBreakdown: { iron: 15, zinc: 30, vitaminA: 30, calcium: 10, protein: 40 },
    icon: '🥚'
  },
  {
    id: 'r5',
    nameEn: 'Sattu Ladoo (Energy Ball)',
    nameHi: 'सत्तू का लड्डू',
    minAgeMonths: 12,
    maxAgeMonths: 59,
    targetNutrients: ['protein', 'iron'],
    prepTimeMinutes: 5,
    cost: 'low',
    ingredientsEn: ['Roasted Gram Flour (Sattu)', 'Jaggery', 'Ghee'],
    ingredientsHi: ['भुना चना आटा (सत्तू)', 'गुड़', 'घी'],
    steps: [
      { textEn: 'Mix sattu, crushed jaggery and ghee.', textHi: 'सत्तू, पिसा हुआ गुड़ और घी मिलाएं।' },
      { textEn: 'Shape into small soft balls.', textHi: 'छोटे नरम लड्डू बना लें।' },
      { textEn: 'Great snack for gaining weight.', textHi: 'वजन बढ़ाने के लिए बेहतरीन नाश्ता।' }
    ],
    nutritionBreakdown: { iron: 25, zinc: 10, vitaminA: 0, calcium: 15, protein: 35 },
    icon: '🍘'
  },
  {
    id: 'r6',
    nameEn: 'Iron-Rich Poha',
    nameHi: 'आयरन वाला पोहा',
    minAgeMonths: 12,
    maxAgeMonths: 59,
    targetNutrients: ['iron', 'vitaminA'],
    prepTimeMinutes: 15,
    cost: 'medium',
    ingredientsEn: ['Flattened Rice (Poha)', 'Peanuts', 'Lemon', 'Coriander'],
    ingredientsHi: ['पोहा', 'मूंगफली', 'नींबू', 'धनिया'],
    steps: [
      { textEn: 'Soak Poha. Roast peanuts.', textHi: 'पोहा भिगो दें। मूंगफली भून लें।' },
      { textEn: 'Cook with little oil. Squeeze lemon at the end (helps absorb iron).', textHi: 'थोड़े तेल में पकाएं। अंत में नींबू निचोड़ें (आयरन सोखने में मदद करता है)।' }
    ],
    nutritionBreakdown: { iron: 45, zinc: 15, vitaminA: 10, calcium: 5, protein: 15 },
    icon: '🥣'
  }
];

// Generator for 30 Mock Children around Kotma, Madhya Pradesh
const KOTMA_LAT = 23.2030;
const KOTMA_LNG = 81.9620;

const generateChildren = (): ChildProfile[] => {
  const names = ["Aarav", "Diya", "Rohan", "Meera", "Vihaan", "Aditi", "Kabir", "Sanya", "Arjun", "Zara", "Ishaan", "Priya", "Ansh", "Kavya", "Dev", "Ananya", "Rahul", "Sneha", "Vikram", "Neha", "Aryan", "Pooja", "Sameer", "Riya", "Kunal", "Tara", "Amit", "Nisha", "Raj", "Simran"];
  
  return names.map((name, i) => {
    // Randomize location slightly around Kotma (within ~2km)
    const lat = KOTMA_LAT + (Math.random() - 0.5) * 0.03;
    const lng = KOTMA_LNG + (Math.random() - 0.5) * 0.03;
    
    // Randomize risk
    const rand = Math.random();
    const riskLevel = rand > 0.8 ? 'high' : rand > 0.5 ? 'medium' : 'low';
    const age = 1 + Math.floor(Math.random() * 47); // 1 to 48 months
    
    // Calculate approximate DOB based on age
    const date = new Date();
    date.setMonth(date.getMonth() - age);
    const dateOfBirth = date.toISOString().split('T')[0];

    const gender = Math.random() > 0.5 ? 'M' : 'F';

    // Generate weight history for the graph
    const weightHistory: { month: number; weight: number }[] = [];
    // Generate about 5-6 months of history ending at current age
    const startMonth = Math.max(1, age - 5);
    
    for (let m = startMonth; m <= age; m++) {
        const standard = getWhoStandard(gender, m);
        // Add random variation based on risk level
        let variance = (Math.random() * 1.5) - 0.5; // Normal variance
        
        if (riskLevel === 'high') variance -= 1.5; // Underweight
        else if (riskLevel === 'medium') variance -= 0.8; // Mildly underweight
        
        // Ensure weight doesn't go below realistic minimum (e.g. 2kg)
        const w = Math.max(2.5, standard + variance);
        weightHistory.push({
            month: m,
            weight: parseFloat(w.toFixed(1))
        });
    }
    
    return {
      id: `c${i+1}`,
      name: name,
      ageMonths: age,
      dateOfBirth, // Added DOB
      gender: gender,
      riskLevel,
      lastLogDate: 'Today',
      streak: Math.floor(Math.random() * 20),
      nutritionStatus: {
        iron: 30 + Math.random() * 70,
        zinc: 30 + Math.random() * 70,
        vitaminA: 30 + Math.random() * 70,
        calcium: 30 + Math.random() * 70,
        protein: 30 + Math.random() * 70,
      },
      weightHistory: weightHistory,
      location: { lat, lng }
    };
  });
};

export const MOCK_CHILDREN = generateChildren();

export const MOCK_ALERTS: Alert[] = [
  { id: 'a1', childId: 'c3', childName: 'Rohan', type: 'growth', severity: 'critical', message: 'Growth faltering risk detected. Immediate home visit required.', date: '2023-10-25' },
  { id: 'a2', childId: 'c5', childName: 'Vihaan', type: 'deficiency', severity: 'medium', message: 'Iron intake below 50% for 3 days.', date: '2023-10-26' },
  { id: 'a3', childId: 'c2', childName: 'Diya', type: 'missing_data', severity: 'medium', message: 'No logs for 48 hours.', date: '2023-10-26' },
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'i1', nameEn: 'IFA Syrup', nameHi: 'आयरन सिरप', quantity: 12, unit: 'bottles', lowStockThreshold: 10 },
  { id: 'i2', nameEn: 'Panjiri (THR)', nameHi: 'पंजीरी (राशन)', quantity: 45, unit: 'packets', lowStockThreshold: 20 },
  { id: 'i3', nameEn: 'Growth Chart Forms', nameHi: 'विकास चार्ट फॉर्म', quantity: 5, unit: 'pads', lowStockThreshold: 10 },
  { id: 'i4', nameEn: 'Vitamin A Drops', nameHi: 'विटामिन ए', quantity: 8, unit: 'bottles', lowStockThreshold: 5 },
];

// Split Badges (Digital/Social)
export const MOCK_BADGES: Badge[] = [
  { id: 'b1', category: 'consistency', nameEn: 'Super Mom', nameHi: 'सुपर मां', icon: '🦸‍♀️', descriptionEn: 'Logged food for 7 days straight', unlocked: true, progress: 100 },
  { id: 'b2', category: 'nutrition', nameEn: 'Iron Warrior', nameHi: 'लौह योद्धा', icon: '🥬', descriptionEn: 'High iron intake for 3 days', unlocked: true, progress: 100 },
  { id: 'b7', category: 'nutrition', nameEn: 'Rainbow Plate', nameHi: 'इंद्रधनुष थाली', icon: '🥗', descriptionEn: 'Ate 5 different colors today', unlocked: true, progress: 100 },
  { id: 'b3', category: 'nutrition', nameEn: 'Milk Master', nameHi: 'दूध उस्ताद', icon: '🥛', descriptionEn: 'Consistent calcium intake for 5 days', unlocked: false, progress: 60 },
  { id: 'b4', category: 'community', nameEn: 'Community Star', nameHi: 'समुदाय सितारा', icon: '🌟', descriptionEn: 'Shared progress 3 times', unlocked: false, progress: 33 },
];

export const MOCK_MYTHS: Myth[] = [
  {
    id: 'm1',
    category: 'general',
    mythEn: "My child shouldn't eat bananas in winter, it causes cold.",
    mythHi: "सर्दी में बच्चे को केला नहीं खिलाना चाहिए, इससे जुकाम होता है।",
    factEn: "Bananas are safe! They provide energy and vitamins.",
    factHi: "केला सुरक्षित है! यह ऊर्जा और विटामिन देता है।",
    rationaleEn: "Cold is caused by viruses, not bananas. Bananas are rich in potassium which helps the body.",
    rationaleHi: "जुकाम वायरस से होता है, केले से नहीं। केला पोटेशियम से भरपूर होता है जो शरीर के लिए अच्छा है।",
    icon: "🍌"
  },
  {
    id: 'm2',
    category: 'general',
    mythEn: "Dal water is enough protein for the baby.",
    mythHi: "दाल का पानी बच्चे के लिए पर्याप्त प्रोटीन है।",
    factEn: "Dal water is mostly water. Mash the dal grains too!",
    factHi: "दाल का पानी केवल पानी है। दाल के दाने भी मसल कर खिलाएं!",
    rationaleEn: "The real protein is in the solid lentils. Feeding only water means the baby misses out on growth nutrients.",
    rationaleHi: "असली प्रोटीन दाल के दानों में होता है। केवल पानी पिलाने से बच्चे को विकास के पोषक तत्व नहीं मिलते।",
    icon: "🥣"
  },
  {
    id: 'm3',
    category: 'general',
    mythEn: "Heavy foods like Ghee cause cough in children.",
    mythHi: "घी जैसा भारी खाना बच्चों को खांसी करता है।",
    factEn: "Ghee provides healthy fats for brain development.",
    factHi: "घी बच्चों के दिमागी विकास के लिए अच्छा फैट देता है।",
    rationaleEn: "In moderation (1 tsp), ghee helps absorb vitamins A, D, E, and K. It does not create mucus.",
    rationaleHi: "सीमित मात्रा (1 चम्मच) में घी विटामिन सोखने में मदद करता है। इससे कफ नहीं बनता।",
    icon: "🧈"
  },
  {
    id: 'm4',
    category: 'ebf',
    mythEn: "I must give water in summer, even if baby is 2 months old.",
    mythHi: "गर्मी में 2 महीने के बच्चे को पानी देना जरूरी है।",
    factEn: "Breastmilk is 88% water. It hydrates the baby perfectly!",
    factHi: "माँ के दूध में 88% पानी होता है। यह बच्चे की प्यास बुझाने के लिए काफी है!",
    rationaleEn: "Giving water can cause infection and reduce milk intake. Just breastfeed more often.",
    rationaleHi: "पानी देने से इन्फेक्शन हो सकता है। बस बार-बार अपना दूध पिलाएं।",
    icon: "💧"
  },
  {
    id: 'm5',
    category: 'ebf',
    mythEn: "My milk is not enough, baby cries a lot.",
    mythHi: "मेरा दूध कम है, बच्चा बहुत रोता है।",
    factEn: "Crying is not always hunger. Check nappies (6+ wet/day).",
    factHi: "रोना हमेशा भूख नहीं होता। डायपर चेक करें (दिन में 6+ गीले)।",
    rationaleEn: "If baby passes urine 6+ times, milk is sufficient. Feed on demand to increase supply.",
    rationaleHi: "अगर बच्चा 6+ बार पेशाब करता है, तो दूध पूरा है। दूध बढ़ाने के लिए बार-बार पिलाएं।",
    icon: "🤱"
  }
];

// Material Rewards only (Stream 1)
export const MOCK_REWARDS: Reward[] = [
  {
    id: 'r1',
    type: 'material',
    threshold: 15,
    nameEn: 'Starter Ration Kit',
    nameHi: 'शुरुआती राशन किट',
    descriptionEn: 'Staples and fortified salt',
    descriptionHi: 'राशन और फोर्टिफाइड नमक',
    icon: '🍚'
  },
  {
    id: 'r2',
    type: 'material',
    threshold: 30,
    nameEn: 'Super Food Kit',
    nameHi: 'सुपर फूड किट',
    descriptionEn: 'Peanuts, Jaggery & Oil',
    descriptionHi: 'मूंगफली, गुड़ और तेल',
    icon: '🥜'
  },
  {
    id: 'r3',
    type: 'material',
    threshold: 60,
    nameEn: 'Mega Nutri-Basket',
    nameHi: 'महा पोषण टोकरी',
    descriptionEn: 'Monthly supply of pulses & soy',
    descriptionHi: 'महीने भर की दाल और सोया',
    icon: '🧺'
  }
];

// Generator for historical data
export const generateMockHistory = (): DailyStats[] => {
  const history: DailyStats[] = [];
  const categories = ['grain', 'pulse', 'veg', 'fruit', 'dairy', 'animal', 'nut_fat'];
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const scoreVal = Math.random();
    const score = scoreVal > 0.6 ? 'good' : scoreVal > 0.3 ? 'average' : 'poor';
    
    const base = score === 'good' ? 80 : score === 'average' ? 50 : 30;
    const variation = () => (Math.random() * 30 - 15);

    const numGroups = Math.floor(Math.random() * 4) + 3;
    const shuffled = categories.sort(() => 0.5 - Math.random());
    const dayGroups = shuffled.slice(0, numGroups);

    history.push({
      date: date.toISOString().split('T')[0],
      nutrients: {
        iron: Math.min(100, Math.max(10, base + variation())),
        zinc: Math.min(100, Math.max(10, base + variation())),
        vitaminA: Math.min(100, Math.max(10, base + variation())),
        calcium: Math.min(100, Math.max(10, base + variation())),
        protein: Math.min(100, Math.max(10, base + variation())),
      },
      score,
      foodGroups: dayGroups
    });
  }
  return history;
};

export const MOCK_HISTORY = generateMockHistory();

export const MOCK_REGIONAL_STATS: RegionalStats = {
  avgIron: 65,
  avgProtein: 58,
  avgVitaminA: 45,
  percentile: 75, // Better than 75%
  trend: 'up',
  avgDDS: 4.2, // Dietary Diversity Score
  stuntingRate: 35, // District %
  wastingRate: 19 // District %
};

// EBF CONFIG DATA
export const EBF_TIMELINE: EbfTip[] = [
  {
    weekStart: 0,
    weekEnd: 1,
    actionEn: "Feed colostrum (thick yellow milk). It is the first vaccine.",
    actionHi: "गाढ़ा पीला दूध (कोलोस्ट्रम) जरूर पिलाएं। यह पहला टीका है।",
    icon: "🛡️"
  },
  {
    weekStart: 2,
    weekEnd: 4,
    actionEn: "Feed on demand, at least 8-12 times day and night.",
    actionHi: "बच्चे की मांग पर पिलाएं, दिन-रात में कम से कम 8-12 बार।",
    icon: "🕰️"
  },
  {
    weekStart: 5,
    weekEnd: 8,
    actionEn: "Empty one breast completely before switching sides.",
    actionHi: "दूसरी तरफ बदलने से पहले एक तरफ का स्तन पूरा खाली करें।",
    icon: "🔄"
  },
  {
    weekStart: 9,
    weekEnd: 12,
    actionEn: "No water even in summer. Your milk hydrates the baby.",
    actionHi: "गर्मी में भी पानी न दें। आपका दूध बच्चे की प्यास बुझाता है।",
    icon: "💧"
  },
  {
    weekStart: 13,
    weekEnd: 16,
    actionEn: "Growth spurt alert! Baby may feed more often. It's normal.",
    actionHi: "बच्चा तेजी से बढ़ रहा है! वह ज्यादा बार दूध मांग सकता है। यह सामान्य है।",
    icon: "📈"
  },
  {
    weekStart: 17,
    weekEnd: 24,
    actionEn: "Prepare for solids. Keep breastfeeding exclusively till 6 months.",
    actionHi: "ठोस आहार की तैयारी करें। 6 महीने तक केवल स्तनपान ही कराएं।",
    icon: "🥣"
  }
];

export const EBF_CHECKIN_QUESTIONS: EbfCheckInQuestion[] = [
  {
    id: "q1",
    questionEn: "Is baby passing urine 6 or more times in 24 hours?",
    questionHi: "क्या बच्चा 24 घंटे में 6 या उससे ज्यादा बार पेशाब कर रहा है?",
    riskAnswer: false, // No is a risk
    riskMessageEn: "Low urine output suggests baby needs more milk.",
    riskMessageHi: "कम पेशाब का मतलब है बच्चे को और दूध चाहिए।"
  },
  {
    id: "q2",
    questionEn: "Is baby feeding at least 8 times a day?",
    questionHi: "क्या बच्चा दिन में कम से कम 8 बार दूध पी रहा है?",
    riskAnswer: false,
    riskMessageEn: "Frequent feeding ensures good supply and growth.",
    riskMessageHi: "बार-बार दूध पिलाने से दूध बढ़ता है और बच्चा बढ़ता है।"
  },
  {
    id: "q3",
    questionEn: "Are you giving any water, honey, or top milk?",
    questionHi: "क्या आप पानी, शहद या ऊपर का दूध दे रहे हैं?",
    riskAnswer: true, // Yes is a risk
    riskMessageEn: "Only breastmilk is needed. Other fluids cause infection.",
    riskMessageHi: "सिर्फ माँ का दूध ही काफी है। अन्य चीजों से इन्फेक्शन होता है।"
  }
];

export const MARKET_ALERT: MarketAlertData = {
  itemEn: "Tomatoes",
  itemHi: "टमाटर",
  priceChange: "+40%",
  trend: "up",
  reasonEn: "Delayed monsoon harvest in Nashik region causing supply shortage.",
  reasonHi: "नासिक क्षेत्र में बारिश के कारण फसल में देरी से आपूर्ति में कमी।",
  impactEn: "Costly Vitamin C source.",
  impactHi: "महंगा विटामिन सी स्रोत।",
  alternatives: [
    {
      nameEn: "Amla (Gooseberry)",
      nameHi: "आंवला",
      benefitEn: "20x Vit C",
      benefitHi: "20 गुना विट-सी",
      saving: "80% cheaper",
      icon: "🍈"
    },
    {
      nameEn: "Tamarind",
      nameHi: "इमली",
      benefitEn: "Tangy Taste",
      benefitHi: "खट्टा स्वाद",
      saving: "60% cheaper",
      icon: "🟤"
    },
    {
      nameEn: "Pumpkin",
      nameHi: "कद्दू",
      benefitEn: "Rich Vit A",
      benefitHi: "विटामिन ए",
      saving: "Stable price",
      icon: "🎃"
    }
  ]
};

export const BOTTLE_SAFETY_STEPS: SafetyStep[] = [
  {
    id: 's1',
    stepEn: 'Wash hands with soap before touching bottle.',
    stepHi: 'बोतल छूने से पहले हाथ साबुन से धोएं।',
    riskEn: 'Germs from hands can cause diarrhea.',
    riskHi: 'हाथों के कीटाणुओं से दस्त हो सकते हैं।',
    icon: '🧼'
  },
  {
    id: 's2',
    stepEn: 'Boil bottle & nipple for 5 mins daily.',
    stepHi: 'बोतल और निप्पल को रोज 5 मिनट उबालें।',
    riskEn: 'Unsterilized bottles breed harmful bacteria.',
    riskHi: 'गंदी बोतल में खतरनाक बैक्टीरिया पनपते हैं।',
    icon: '🔥'
  },
  {
    id: 's3',
    stepEn: 'Check milk temperature on wrist.',
    stepHi: 'कलाई पर दूध का तापमान जांचें।',
    riskEn: 'Hot milk can burn baby\'s mouth.',
    riskHi: 'गर्म दूध बच्चे का मुंह जला सकता है।',
    icon: '🌡️'
  },
  {
    id: 's4',
    stepEn: 'Discard leftover milk after 1 hour.',
    stepHi: '1 घंटे बाद बचा हुआ दूध फेंक दें।',
    riskEn: 'Bacteria grows rapidly in used milk.',
    riskHi: 'जूठे दूध में बैक्टीरिया तेजी से बढ़ते हैं।',
    icon: '⏳'
  }
];