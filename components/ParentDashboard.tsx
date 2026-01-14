import React, { useState, useEffect } from 'react';
import { FoodItem, LogEntry, Language, NutrientProfile, ChildProfile, Myth, Recipe, Reward, BadgeCategory, EbfCheckInQuestion } from '../types';
import { FOOD_DB, TRANSLATIONS, MOCK_BADGES, MOCK_CHILDREN, MOCK_MYTHS, RECIPE_DB, MOCK_REWARDS, getWhoStandard, MOCK_HISTORY, MOCK_REGIONAL_STATS, EBF_TIMELINE, EBF_CHECKIN_QUESTIONS, MOCK_ALERTS, MARKET_ALERT, BOTTLE_SAFETY_STEPS } from '../constants';
import NutritionChart from './NutritionChart';
import { getNutritionAdvice } from '../services/gemini';
import { Search, Plus, Send, Flame, Award, ChevronRight, Mic, Calendar, Users, X, Activity, ToggleLeft, ToggleRight, Lightbulb, ChevronDown, ChevronUp, AlertCircle, CheckCircle2, Clock, ChefHat, Gift, QrCode, Share2, Trophy, Lock, BarChart2, TrendingUp, PieChart, Info, Map, Target, ArrowUpRight, Scale, Medal, Star, Utensils, Baby, Droplets, Phone, AlertTriangle, Leaf, LayoutDashboard, MessageCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, ReferenceLine, BarChart, Bar, Cell, AreaChart, Area, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

interface Props {
  language: Language;
}

const ParentDashboard: React.FC<Props> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'home' | 'meals' | 'log' | 'progress' | 'chat' | 'coach'>('home');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<LogEntry['unit']>('katori');
  const [todayStats, setTodayStats] = useState<NutrientProfile>({ iron: 0, zinc: 0, vitaminA: 0, calcium: 0, protein: 0 });
  const [streak, setStreak] = useState(12);
  const [showChildProfile, setShowChildProfile] = useState(false);
  const [expandedMythId, setExpandedMythId] = useState<string | null>(null);
  
  // New Achievements States
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [achievementsTab, setAchievementsTab] = useState<'streak' | 'material' | 'social'>('streak');
  const [redeemedRewards, setRedeemedRewards] = useState<Set<string>>(new Set());
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [optInSocial, setOptInSocial] = useState(false);
  
  const [progressView, setProgressView] = useState<'7d' | '30d'>('7d');
  
  // Recipe Recommendation States
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // EBF Coach State
  const [checkInStatus, setCheckInStatus] = useState<'pending' | 'safe' | 'risk'>('pending');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Bottle Safety State
  const [checkedSafetySteps, setCheckedSafetySteps] = useState<Set<string>>(new Set());

  // Use the first mock child as the parent's child for demo
  const myChild = MOCK_CHILDREN[0];

  // Chat State
  const [chatQuery, setChatQuery] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: language === 'hi' ? "नमस्ते! मैं पोषण दीदी हूँ। अपने बच्चे के खाने के बारे में मुझसे पूछें।" : "Hello! I am Poshan Didi. Ask me about your child's food." }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Calculate nutrition whenever logs change
  useEffect(() => {
    const newStats: NutrientProfile = { iron: 0, zinc: 0, vitaminA: 0, calcium: 0, protein: 0 };
    logs.forEach(log => {
      const food = FOOD_DB.find(f => f.id === log.foodId);
      if (food) {
        newStats.iron += food.nutrients.iron * log.quantity;
        newStats.zinc += food.nutrients.zinc * log.quantity;
        newStats.vitaminA += food.nutrients.vitaminA * log.quantity;
        newStats.calcium += food.nutrients.calcium * log.quantity;
        newStats.protein += food.nutrients.protein * log.quantity;
      }
    });
    setTodayStats(newStats);
  }, [logs]);

  const handleAddFood = () => {
    if (selectedFood) {
      const newLog: LogEntry = { foodId: selectedFood.id, quantity, unit };
      // Use functional update to ensure reliability
      setLogs(prev => [...prev, newLog]);
      setSelectedFood(null);
      setQuantity(1);
      setUnit('katori');
      setActiveTab('home');
    }
  };

  const handleSendMessage = async () => {
    if (!chatQuery.trim()) return;
    const newHistory = [...chatHistory, { role: 'user' as const, text: chatQuery }];
    setChatHistory(newHistory);
    setChatQuery('');
    setIsChatLoading(true);

    const response = await getNutritionAdvice(chatQuery, language);
    setChatHistory([...newHistory, { role: 'ai', text: response }]);
    setIsChatLoading(false);
  };

  const simulateVoiceInput = () => {
      setIsListening(true);
      setTimeout(() => {
          setIsListening(false);
          setChatQuery(language === 'hi' ? "मेरा बच्चा दाल नहीं खाता, क्या करूँ?" : "My child refuses to eat lentils, what should I do?");
      }, 2000);
  };

  const getPersonalizedRecipes = (): Recipe[] => {
    // 1. Identify Gaps
    const gaps: (keyof NutrientProfile)[] = [];
    if (todayStats.iron < 50) gaps.push('iron');
    if (todayStats.protein < 50) gaps.push('protein');
    if (todayStats.vitaminA < 50) gaps.push('vitaminA');
    if (todayStats.calcium < 50) gaps.push('calcium');
    if (todayStats.zinc < 50) gaps.push('zinc');

    // 2. Filter by Age
    let suitableRecipes = RECIPE_DB.filter(r => 
        myChild.ageMonths >= r.minAgeMonths && 
        myChild.ageMonths <= r.maxAgeMonths
    );

    // 3. Score recipes based on matching gaps
    if (gaps.length > 0) {
        suitableRecipes.sort((a, b) => {
            const aMatches = a.targetNutrients.filter(n => gaps.includes(n)).length;
            const bMatches = b.targetNutrients.filter(n => gaps.includes(n)).length;
            return bMatches - aMatches;
        });
    }

    // Return top 3 recommendations
    return suitableRecipes.slice(0, 3);
  };

  const handleCookedRecipe = () => {
      setStreak(s => s + 1);
      setSelectedRecipe(null);
      // Trigger a confetti or success state here if implemented
  };

  // Find next reward for progress bar
  const nextReward = MOCK_REWARDS.find(r => r.threshold > streak) || MOCK_REWARDS[MOCK_REWARDS.length - 1];
  const progressPercent = Math.min(100, (streak / nextReward.threshold) * 100);

  // EBF Logic
  const getBabyWeeks = () => {
      if (!myChild.dateOfBirth) return myChild.ageMonths * 4;
      const dob = new Date(myChild.dateOfBirth);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - dob.getTime());
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));
      return diffWeeks;
  };
  const babyWeeks = getBabyWeeks();
  const currentEbfTip = EBF_TIMELINE.find(tip => babyWeeks >= tip.weekStart && babyWeeks <= tip.weekEnd) || EBF_TIMELINE[EBF_TIMELINE.length - 1];

  const handleEbfCheckIn = (answer: boolean) => {
      const question = EBF_CHECKIN_QUESTIONS[currentQuestionIndex];
      const isRisk = answer === question.riskAnswer;

      if (isRisk) {
          setCheckInStatus('risk');
          // In a real app, this would perform an API call to create an alert
          MOCK_ALERTS.unshift({
            id: `alert-${Date.now()}`,
            childId: myChild.id,
            childName: myChild.name,
            type: 'ebf_risk',
            severity: 'high',
            message: language === 'hi' ? question.riskMessageHi : question.riskMessageEn,
            date: new Date().toISOString().split('T')[0]
          });
      } else if (currentQuestionIndex < EBF_CHECKIN_QUESTIONS.length - 1) {
          setCurrentQuestionIndex(prev => prev + 1);
      } else {
          setCheckInStatus('safe');
      }
  };

  const toggleSafetyStep = (id: string) => {
    const newSet = new Set(checkedSafetySteps);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setCheckedSafetySteps(newSet);
  };

  const contactWorker = () => {
      alert(language === 'hi' ? "आंगनवाड़ी दीदी को संदेश भेजा गया!" : "Message sent to Anganwadi Didi!");
  };

  // --- Sub-Components ---
  
  const RecipeModal = () => {
      if (!selectedRecipe) return null;

      return (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                  {/* Header Image/Icon Area */}
                  <div className="bg-orange-50 p-6 flex flex-col items-center justify-center relative shrink-0">
                       <button onClick={() => setSelectedRecipe(null)} className="absolute top-4 right-4 bg-white/50 p-1.5 rounded-full hover:bg-white transition-colors">
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                        <div className="text-6xl mb-2">{selectedRecipe.icon}</div>
                        <h2 className="text-2xl font-bold text-center text-gray-800 leading-tight">
                            {language === 'hi' ? selectedRecipe.nameHi : selectedRecipe.nameEn}
                        </h2>
                        <div className="flex gap-2 mt-3">
                            {selectedRecipe.targetNutrients.map(n => (
                                <span key={n} className="text-[10px] uppercase font-bold bg-white text-orange-600 px-2 py-1 rounded-full border border-orange-100 shadow-sm">
                                    {n} Boost
                                </span>
                            ))}
                        </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-6">
                       {/* Meta Data */}
                       <div className="flex justify-between text-center divide-x divide-gray-100 bg-gray-50 p-3 rounded-xl">
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase font-bold">{t.prep}</p>
                                <p className="font-semibold text-gray-800">{selectedRecipe.prepTimeMinutes} {t.mins}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase font-bold">{t.cost}</p>
                                <p className="font-semibold text-gray-800 capitalize">{selectedRecipe.cost}</p>
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 uppercase font-bold">{t.ageSuitability}</p>
                                <p className="font-semibold text-gray-800">{selectedRecipe.minAgeMonths}+ m</p>
                            </div>
                       </div>

                       {/* Ingredients */}
                       <div>
                           <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                               <Utensils className="w-4 h-4 text-orange-500" /> {t.ingredients}
                           </h3>
                           <ul className="grid grid-cols-2 gap-2">
                               {(language === 'hi' ? selectedRecipe.ingredientsHi : selectedRecipe.ingredientsEn).map((ing, i) => (
                                   <li key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
                                       <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div> {ing}
                                   </li>
                               ))}
                           </ul>
                       </div>

                       {/* Instructions */}
                       <div>
                           <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                               <ChefHat className="w-4 h-4 text-orange-500" /> {t.cookingInstructions}
                           </h3>
                           <div className="space-y-4">
                               {selectedRecipe.steps.map((step, i) => (
                                   <div key={i} className="flex gap-3">
                                       <div className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-100 text-orange-600 font-bold text-sm flex items-center justify-center mt-0.5">
                                           {i + 1}
                                       </div>
                                       <div>
                                           <p className="text-sm text-gray-700 leading-relaxed">
                                               {language === 'hi' ? step.textHi : step.textEn}
                                           </p>
                                           {step.image && (
                                               <div className="mt-2 h-24 bg-gray-100 rounded-lg w-full"></div> // Placeholder for step image
                                           )}
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-4 border-t border-gray-100 bg-white">
                      <button 
                        onClick={handleCookedRecipe}
                        className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                          <CheckCircle2 className="w-5 h-5" /> {t.cookThis}
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  const AchievementsModal = () => {
      if (!showAchievementsModal) return null;
      
      const nextMaterialReward = MOCK_REWARDS.find(r => r.threshold > streak) || MOCK_REWARDS[MOCK_REWARDS.length - 1];
      const streakProgress = Math.min(100, (streak / nextMaterialReward.threshold) * 100);

      const handleMaterialRedeem = (reward: Reward) => {
        setSelectedReward(reward);
        setShowQrModal(true);
        setShowAchievementsModal(false);
      };

      return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-5 text-white flex justify-between items-start shrink-0">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2"><Trophy className="w-6 h-6 text-yellow-300" /> {t.rewards}</h2>
                        <p className="text-orange-100 text-sm">{t.progress}: {streak} {language === 'hi' ? 'दिन' : 'Days'}</p>
                    </div>
                    <button onClick={() => setShowAchievementsModal(false)} className="bg-white/20 p-1.5 rounded-full hover:bg-white/30 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tab Nav */}
                <div className="flex border-b border-gray-100">
                   <button 
                     onClick={() => setAchievementsTab('streak')} 
                     className={`flex-1 py-3 text-sm font-semibold flex flex-col items-center gap-1 ${achievementsTab === 'streak' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' : 'text-gray-500'}`}
                   >
                     <Flame className="w-4 h-4" /> {t.streakTitle}
                   </button>
                   <button 
                     onClick={() => setAchievementsTab('material')} 
                     className={`flex-1 py-3 text-sm font-semibold flex flex-col items-center gap-1 ${achievementsTab === 'material' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' : 'text-gray-500'}`}
                   >
                     <Gift className="w-4 h-4" /> {t.materialTitle}
                   </button>
                   <button 
                     onClick={() => setAchievementsTab('social')} 
                     className={`flex-1 py-3 text-sm font-semibold flex flex-col items-center gap-1 ${achievementsTab === 'social' ? 'text-orange-600 border-b-2 border-orange-500 bg-orange-50' : 'text-gray-500'}`}
                   >
                     <Medal className="w-4 h-4" /> {t.socialTitle}
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 bg-gray-50">
                    
                    {/* Stream 1: Streak / Gamification */}
                    {achievementsTab === 'streak' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-100 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-orange-500"></div>
                                <div className="w-24 h-24 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-4 text-5xl relative">
                                    🔥
                                    <div className="absolute -bottom-2 bg-orange-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                        Level {Math.floor(streak / 7) + 1}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">{streak} Days</h3>
                                <p className="text-gray-500 text-sm mb-4">You are on fire! Keep logging daily.</p>
                                
                                {/* Progress Bar */}
                                <div className="relative pt-2">
                                    <div className="flex justify-between text-xs font-bold text-gray-400 mb-1 uppercase">
                                        <span>Current</span>
                                        <span>Goal: {nextMaterialReward.threshold}</span>
                                    </div>
                                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                                        <div className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-1000" style={{width: `${streakProgress}%`}}></div>
                                    </div>
                                    <p className="text-xs text-orange-600 font-medium mt-2 text-right">{nextMaterialReward.threshold - streak} {t.daysToNext}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="font-bold text-gray-700 text-sm">Milestones</h4>
                                {[7, 14, 30, 60].map(day => (
                                    <div key={day} className={`flex items-center justify-between p-3 rounded-xl border ${streak >= day ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200 opacity-60'}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${streak >= day ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                {streak >= day ? <CheckCircle2 className="w-5 h-5" /> : day}
                                            </div>
                                            <span className={`text-sm font-medium ${streak >= day ? 'text-green-800' : 'text-gray-500'}`}>{day} Day Streak</span>
                                        </div>
                                        {streak >= day && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Achieved</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stream 2: Material Rewards */}
                    {achievementsTab === 'material' && (
                        <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                             <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex gap-3 items-start">
                                 <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                 <p className="text-xs text-blue-700 leading-relaxed">
                                     Earn physical nutrition kits by maintaining your streak. Redeem these at your Anganwadi center.
                                 </p>
                             </div>

                             {MOCK_REWARDS.filter(r => r.type === 'material').map((reward, i) => {
                                 const isUnlocked = streak >= reward.threshold;
                                 const isRedeemed = redeemedRewards.has(reward.id);

                                 return (
                                     <div key={reward.id} className={`bg-white rounded-xl border-2 p-4 relative ${isUnlocked ? 'border-orange-200 shadow-sm' : 'border-gray-100 opacity-70 grayscale'}`}>
                                         {/* Connector Line */}
                                         {i !== MOCK_REWARDS.length - 1 && <div className="absolute left-8 bottom-[-20px] w-0.5 h-6 bg-gray-200 z-0"></div>}
                                         
                                         <div className="flex gap-4 relative z-10">
                                             <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 ${isUnlocked ? 'bg-orange-100' : 'bg-gray-100'}`}>
                                                 {reward.icon}
                                             </div>
                                             <div className="flex-1">
                                                 <h4 className="font-bold text-gray-800">{language === 'hi' ? reward.nameHi : reward.nameEn}</h4>
                                                 <p className="text-xs text-gray-500 mb-3">{language === 'hi' ? reward.descriptionHi : reward.descriptionEn}</p>
                                                 
                                                 {isUnlocked ? (
                                                     <button 
                                                        onClick={() => !isRedeemed && handleMaterialRedeem(reward)}
                                                        className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 ${isRedeemed ? 'bg-green-100 text-green-700 cursor-default' : 'bg-orange-600 text-white hover:bg-orange-700 shadow-md active:scale-95'}`}
                                                     >
                                                         {isRedeemed ? <><CheckCircle2 className="w-4 h-4" /> Redeemed</> : <><Gift className="w-4 h-4" /> {t.redeem}</>}
                                                     </button>
                                                 ) : (
                                                     <div className="bg-gray-100 text-gray-500 text-xs py-1.5 px-3 rounded-lg inline-flex items-center gap-2 font-medium">
                                                         <Lock className="w-3 h-3" /> Unlocks at {reward.threshold} days
                                                     </div>
                                                 )}
                                             </div>
                                         </div>
                                     </div>
                                 );
                             })}
                        </div>
                    )}

                    {/* Stream 3: Social Recognition (Hall of Fame) */}
                    {achievementsTab === 'social' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                            {/* Opt-in Section */}
                            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-indigo-900 text-sm flex items-center gap-2">
                                        <Users className="w-4 h-4" /> {t.optInTitle}
                                    </h3>
                                    <button 
                                        onClick={() => setOptInSocial(!optInSocial)} 
                                        className={`w-10 h-6 rounded-full p-1 transition-colors ${optInSocial ? 'bg-green-500' : 'bg-gray-300'}`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${optInSocial ? 'translate-x-4' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                                <p className="text-xs text-indigo-700 mb-2">{t.optInDesc}</p>
                                {optInSocial && <p className="text-xs text-green-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> {t.optInSuccess}</p>}
                            </div>

                            {/* Digital Badges Grid */}
                            <div>
                                <h4 className="font-bold text-gray-700 text-sm mb-3 flex items-center gap-2">
                                    <Star className="w-4 h-4 text-yellow-500" /> Digital Badges
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {MOCK_BADGES.map(badge => (
                                        <div key={badge.id} className={`p-3 rounded-xl border flex flex-col items-center text-center ${badge.unlocked ? 'bg-white border-yellow-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                                            <div className="text-3xl mb-2">{badge.icon}</div>
                                            <h5 className="font-bold text-xs text-gray-800 leading-tight mb-1">{language === 'hi' ? badge.nameHi : badge.nameEn}</h5>
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${badge.unlocked ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-500'}`}>
                                                {badge.unlocked ? 'Earned' : 'Locked'}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
      );
  };

  const QRModal = () => {
    if (!showQrModal || !selectedReward) return null;

    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-6 backdrop-blur-md animate-in fade-in zoom-in">
             <div className="bg-white w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-pink-500"></div>
                <button onClick={() => {setShowQrModal(false); setShowAchievementsModal(true);}} className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200">
                    <X className="w-5 h-5 text-gray-600" />
                </button>

                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                    {selectedReward.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-1">{language === 'hi' ? selectedReward.nameHi : selectedReward.nameEn}</h3>
                <p className="text-gray-500 text-sm mb-6">{t.scanInstruction}</p>

                <div className="bg-white p-4 rounded-xl border-4 border-gray-900 inline-block mb-6 relative group">
                     {/* Simulated QR Code Pattern */}
                     <div className="w-48 h-48 grid grid-cols-5 gap-1 bg-gray-900 p-1">
                        {Array.from({length: 25}).map((_, i) => (
                            <div key={i} className={`bg-white ${[0,4,12,20,24].includes(i) ? 'rounded-sm' : i%2===0 ? 'opacity-100' : 'opacity-0'}`}></div>
                        ))}
                        <div className="absolute inset-0 flex items-center justify-center">
                             <div className="bg-white p-2 rounded-lg">
                                 <QrCode className="w-8 h-8 text-black" />
                             </div>
                        </div>
                     </div>
                     <div className="absolute bottom-[-20px] left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md text-xs font-mono border border-gray-200">
                         #RWD-{selectedReward.id.toUpperCase()}-{Math.floor(Math.random()*1000)}
                     </div>
                </div>

                <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg flex items-center gap-2 text-left">
                    <Activity className="w-4 h-4 shrink-0" />
                    <span>Redeemable at your local Anganwadi Center between 9 AM - 2 PM.</span>
                </div>
             </div>
        </div>
    );
  };

  const ChildProfileModal = () => {
    const [showWhoCurve, setShowWhoCurve] = useState(false);
    
    if (!showChildProfile) return null;

    const chartData = myChild.weightHistory.map(h => ({
        ...h,
        standard: getWhoStandard(myChild.gender, h.month)
    }));

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
                <div className="bg-brand-500 p-4 flex justify-between items-start text-white">
                    <div>
                        <h2 className="text-xl font-bold">{myChild.name}</h2>
                        <p className="text-brand-100 text-sm">{myChild.ageMonths} {t.age}</p>
                    </div>
                    <button onClick={() => setShowChildProfile(false)} className="bg-white/20 p-1 rounded-full hover:bg-white/30">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-4 space-y-4">
                     <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-brand-500" /> {t.growthChart}
                            </h3>
                            <button 
                                onClick={() => setShowWhoCurve(!showWhoCurve)}
                                className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors"
                            >
                                {showWhoCurve ? <ToggleRight className="w-8 h-8 text-brand-600" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                                WHO Standard
                            </button>
                        </div>
                        
                        <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis dataKey="month" tick={{fontSize: 10}} label={{ value: 'Age (m)', position: 'insideBottomRight', offset: -5, fontSize: 10 }} />
                            <YAxis domain={['dataMin - 2', 'dataMax + 2']} tick={{fontSize: 10}} width={30} />
                            <Tooltip 
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                        <div className="bg-white p-2 border border-gray-100 shadow-xl rounded-lg text-xs z-50">
                                            <p className="font-bold text-gray-700 mb-1">{label} Months</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-brand-500"></div>
                                                <p className="text-brand-700 font-medium">Child: {payload[0].value} kg</p>
                                            </div>
                                            {payload[1] && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                                                    <p className="text-slate-500">WHO Std: {payload[1].value} kg</p>
                                                </div>
                                            )}
                                        </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            {showWhoCurve && (
                                <Line 
                                    type="monotone" 
                                    dataKey="standard" 
                                    stroke="#94a3b8" 
                                    strokeWidth={2} 
                                    strokeDasharray="5 5" 
                                    dot={false} 
                                    activeDot={false}
                                />
                            )}
                            <Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={3} dot={{r: 4, fill: '#f97316'}} activeDot={{r: 6}} />
                            </LineChart>
                        </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-center text-gray-500 mt-2">
                            {language === 'hi' ? 'आपका बच्चा स्वस्थ रूप से बढ़ रहा है!' : 'Your child is growing healthily!'}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                            <div className="text-xs text-blue-500 font-semibold">Weight</div>
                            <div className="text-lg font-bold text-blue-700">9.5 kg</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-xl border border-green-100">
                            <div className="text-xs text-green-500 font-semibold">Height</div>
                            <div className="text-lg font-bold text-green-700">76 cm</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const renderMythBuster = () => (
    <div className="space-y-4">
        <h3 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
           <Lightbulb className="w-5 h-5" />
           {t.mythBusters}
        </h3>
        <div className="space-y-4">
            {MOCK_MYTHS.filter(m => activeTab === 'coach' ? m.category === 'ebf' : m.category !== 'ebf').map((myth) => {
                const isExpanded = expandedMythId === myth.id;
                return (
                    <div key={myth.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100 transition-all duration-300">
                        <div className="p-4 bg-purple-50 flex items-start gap-3">
                            <div className="text-2xl mt-1">{myth.icon}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                    <span className="text-xs font-bold text-red-500 uppercase tracking-wider">{t.myth}</span>
                                </div>
                                <h4 className="font-semibold text-gray-800 text-lg leading-snug">
                                    {language === 'hi' ? myth.mythHi : myth.mythEn}
                                </h4>
                            </div>
                        </div>

                        {/* Interactive Toggle */}
                        {isExpanded ? (
                            <div className="p-4 bg-white animate-in fade-in slide-in-from-top-2 duration-300">
                                <div className="flex items-start gap-3 mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <span className="text-xs font-bold text-green-600 uppercase tracking-wider">{t.fact}</span>
                                        <p className="font-bold text-gray-800 text-lg">
                                            {language === 'hi' ? myth.factHi : myth.factEn}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-sm text-gray-700 leading-relaxed">
                                    {language === 'hi' ? myth.rationaleHi : myth.rationaleEn}
                                </div>
                                <button 
                                    onClick={() => setExpandedMythId(null)}
                                    className="w-full mt-4 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg flex items-center justify-center gap-1"
                                >
                                    {t.hideTruth} <ChevronUp className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => setExpandedMythId(myth.id)}
                                className="w-full py-3 bg-white text-brand-600 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-brand-50 transition-colors border-t border-purple-100"
                            >
                                {t.revealTruth} <ChevronDown className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                );
            })}
        </div>
    </div>
  );

  const renderEbfCoachTab = () => {
    return (
        <div className="space-y-6 pb-6 animate-in fade-in duration-300">
            {/* Baby Age Header */}
            <div className="bg-brand-50 rounded-xl p-4 flex items-center gap-4 shadow-sm border border-brand-100">
                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border border-brand-200">
                    👶
                </div>
                <div>
                    <p className="text-xs text-brand-600 uppercase font-bold tracking-wider">{t.babyAge}</p>
                    <h2 className="text-xl font-bold text-gray-800">{babyWeeks} {t.week}s</h2>
                    <p className="text-xs text-gray-500">Exclusive Breastfeeding Phase (0-6m)</p>
                </div>
            </div>

            {/* Weekly Guidance Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-orange-500 p-4 text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                        {t.week} {babyWeeks} Focus
                    </h3>
                </div>
                <div className="p-6 text-center">
                    <div className="text-6xl mb-4">{currentEbfTip.icon}</div>
                    <p className="text-xl font-bold text-gray-800 leading-snug mb-2">
                        {language === 'hi' ? currentEbfTip.actionHi : currentEbfTip.actionEn}
                    </p>
                    {/* Placeholder for Media/Audio */}
                    <div className="mt-6 flex justify-center">
                         <button className="bg-brand-50 text-brand-600 px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 border border-brand-200 shadow-sm active:scale-95 transition-transform">
                             <span className="w-6 h-6 bg-brand-600 text-white rounded-full flex items-center justify-center text-xs">▶</span>
                             Play Audio
                         </button>
                    </div>
                </div>
            </div>

            {/* Smart Check-In */}
            <div className={`rounded-xl p-5 border shadow-sm transition-colors ${checkInStatus === 'risk' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                {checkInStatus === 'pending' ? (
                    <>
                        <h3 className="font-bold text-gray-800 mb-1 flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" /> {t.checkInTitle}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">{t.checkInDesc}</p>
                        
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                            <p className="font-medium text-lg text-gray-800 mb-4 text-center">
                                {language === 'hi' ? EBF_CHECKIN_QUESTIONS[currentQuestionIndex].questionHi : EBF_CHECKIN_QUESTIONS[currentQuestionIndex].questionEn}
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => handleEbfCheckIn(true)}
                                    className="py-3 bg-green-100 text-green-800 rounded-lg font-bold border-b-4 border-green-200 active:border-b-0 active:translate-y-1 transition-all"
                                >
                                    {t.yes}
                                </button>
                                <button 
                                    onClick={() => handleEbfCheckIn(false)}
                                    className="py-3 bg-red-100 text-red-800 rounded-lg font-bold border-b-4 border-red-200 active:border-b-0 active:translate-y-1 transition-all"
                                >
                                    {t.no}
                                </button>
                            </div>
                            <div className="mt-4 flex justify-center gap-1">
                                {EBF_CHECKIN_QUESTIONS.map((_, idx) => (
                                    <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentQuestionIndex ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : checkInStatus === 'safe' ? (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-green-800 text-lg">{t.allGood}</h3>
                        <p className="text-sm text-green-700">{t.allGoodDesc}</p>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">
                            <AlertCircle className="w-8 h-8" />
                        </div>
                        <h3 className="font-bold text-red-800 text-lg">{t.riskDetected}</h3>
                        <p className="text-sm text-red-700 mb-4">{t.riskDetectedDesc}</p>
                        <button 
                            onClick={contactWorker}
                            className="bg-red-600 text-white px-6 py-2 rounded-full font-bold shadow-md hover:bg-red-700 flex items-center gap-2 mx-auto"
                        >
                            <Phone className="w-4 h-4" /> {t.contactWorker}
                        </button>
                    </div>
                )}
            </div>

            {/* Direct Connect to Worker */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" /> {t.contactWorker}
                </h3>
                <div className="flex gap-3">
                    <button onClick={contactWorker} className="flex-1 bg-purple-50 text-purple-700 py-3 rounded-lg font-semibold flex flex-col items-center gap-1 border border-purple-100 active:bg-purple-100">
                        <Mic className="w-5 h-5" />
                        <span className="text-xs">{t.voiceMessage}</span>
                    </button>
                    <button onClick={contactWorker} className="flex-1 bg-green-50 text-green-700 py-3 rounded-lg font-semibold flex flex-col items-center gap-1 border border-green-100 active:bg-green-100">
                        <Phone className="w-5 h-5" />
                        <span className="text-xs">{t.call}</span>
                    </button>
                </div>
            </div>

            {/* Myth Buster Module (Reusing component with filtered myths) */}
            <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100">
               {renderMythBuster()}
            </div>
        </div>
    );
  };

  const renderMealsTab = () => {
    const recommendedRecipes = getPersonalizedRecipes();
    
    return (
        <div className="space-y-6 pb-6 animate-in fade-in duration-300">
            {/* Seasonal Food Alert - DETAILED SECTION */}
            <div className="bg-white rounded-xl shadow-md border border-red-100 overflow-hidden">
                {/* Header - Red Alert */}
                <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wide mb-1">
                            <TrendingUp className="w-4 h-4" /> {t.seasonalAlert}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">
                            {language === 'hi' ? MARKET_ALERT.itemHi : MARKET_ALERT.itemEn} Price Surge
                        </h3>
                        <p className="text-red-600 font-bold text-2xl mt-1">
                            {MARKET_ALERT.priceChange} <span className="text-xs font-normal text-gray-500">vs last month</span>
                        </p>
                    </div>
                    <div className="text-5xl">🍅</div>
                </div>

                {/* Insight Section */}
                <div className="p-4 bg-white">
                    <div className="flex gap-2 items-start text-xs text-gray-600 mb-5 bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold mb-1">Why?</p>
                            <p>{language === 'hi' ? MARKET_ALERT.reasonHi : MARKET_ALERT.reasonEn}</p>
                            <p className="mt-1 text-red-500 font-medium">Impact: {language === 'hi' ? MARKET_ALERT.impactHi : MARKET_ALERT.impactEn}</p>
                        </div>
                    </div>

                    {/* Alternatives Header */}
                    <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <Leaf className="w-4 h-4 text-green-600" /> 
                        {t.smartSwaps}
                    </h4>

                    {/* Alternatives List */}
                    <div className="space-y-3">
                        {MARKET_ALERT.alternatives.map((alt, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-green-100 bg-green-50/30">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{alt.icon}</span>
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm">{language === 'hi' ? alt.nameHi : alt.nameEn}</p>
                                        <p className="text-[10px] text-green-700 font-bold uppercase tracking-wide bg-green-100 px-1.5 py-0.5 rounded w-fit mt-0.5">
                                            {language === 'hi' ? alt.benefitHi : alt.benefitEn}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-xs font-bold bg-white border border-green-200 text-green-700 px-2 py-1 rounded-lg shadow-sm">
                                    {alt.saving}
                                </span>
                            </div>
                        ))}
                    </div>
                    
                    {/* Footer Source */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-[10px] text-gray-400">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> Forecast: High until Nov</span>
                        <span>{t.faoSource}</span>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <h2 className="text-xl font-bold text-orange-900 flex items-center gap-2 mb-2">
                    <ChefHat className="w-6 h-6" /> {t.recommendations}
                </h2>
                <p className="text-sm text-orange-700">
                    {t.recipeGenerated} <span className="font-bold">{myChild.name}</span> ({myChild.ageMonths}m) {t.recommendationSubtitle}
                </p>
            </div>

            {/* Recommendations Grid */}
            <div className="space-y-4">
                {recommendedRecipes.map(recipe => (
                    <div 
                        key={recipe.id}
                        onClick={() => setSelectedRecipe(recipe)}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden active:scale-98 transition-transform cursor-pointer"
                    >
                        <div className="p-4 flex gap-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-4xl shrink-0">
                                {recipe.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">
                                        {language === 'hi' ? recipe.nameHi : recipe.nameEn}
                                    </h3>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {recipe.targetNutrients.slice(0, 2).map(n => (
                                        <span key={n} className="text-[10px] uppercase font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                                            {n}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-gray-500 font-medium">
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {recipe.prepTimeMinutes}m</span>
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {recipe.minAgeMonths}-{recipe.maxAgeMonths}m</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* General Advice Card */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 flex gap-3">
                 <div className="bg-blue-100 text-blue-600 p-2 rounded-lg h-fit">
                     <Info className="w-5 h-5" />
                 </div>
                 <div className="text-sm text-blue-800">
                     <p className="font-bold mb-1">Remember, Mom:</p>
                     <p className="leading-relaxed">Consistency is key! Try to include one iron-rich food (like green leafy vegetables) in every main meal.</p>
                 </div>
            </div>
        </div>
    );
  };

  const renderProgress = () => {
    // Icons for food groups
    const categoryIcons: Record<string, string> = {
        grain: '🌾', pulse: '🍲', veg: '🥬', fruit: '🍌', dairy: '🥛', animal: '🥚', nut_fat: '🥜'
    };

    // Prepare Trend Data (7 days or 30 days)
    const daysToShow = progressView === '30d' ? 30 : 7;
    const trendData = MOCK_HISTORY.slice(0, daysToShow).reverse().map(d => ({
        day: d.date.split('-')[2],
        fullDate: d.date,
        iron: d.nutrients.iron,
        protein: d.nutrients.protein,
        vitA: d.nutrients.vitaminA
    }));

    // Average stats for Radar Chart
    const avgStats = trendData.reduce((acc, curr) => ({
        iron: acc.iron + curr.iron,
        protein: acc.protein + curr.protein,
        vitA: acc.vitA + curr.vitA
    }), { iron: 0, protein: 0, vitA: 0 });
    
    // Simple average calculation
    const count = trendData.length;
    const radarData = [
        { subject: 'Iron', A: Math.round(avgStats.iron / count), fullMark: 100 },
        { subject: 'Protein', A: Math.round(avgStats.protein / count), fullMark: 100 },
        { subject: 'Vit A', A: Math.round(avgStats.vitA / count), fullMark: 100 },
        // Mock data for other nutrients to complete the spider
        { subject: 'Zinc', A: Math.round((avgStats.iron / count) * 0.9), fullMark: 100 },
        { subject: 'Calcium', A: Math.round((avgStats.protein / count) * 1.1), fullMark: 100 },
    ];

    return (
        <div className="space-y-6 pb-6 animate-in fade-in duration-300">
            {/* Header */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-brand-500">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-brand-500" />
                    {t.stats}
                </h2>
                <div className="flex gap-2 mt-3">
                    <button 
                        onClick={() => setProgressView('7d')}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${progressView === '7d' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        {t.thisWeek}
                    </button>
                    <button 
                        onClick={() => setProgressView('30d')}
                        className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${progressView === '30d' ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                        {t.monthView}
                    </button>
                </div>
            </div>

            {/* WHO Standard Comparison Radar Chart */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-500" /> {t.whoStandard}
                </h3>
                <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                            <Radar
                                name={t.childIntake}
                                dataKey="A"
                                stroke="#f97316"
                                strokeWidth={2}
                                fill="#f97316"
                                fillOpacity={0.4}
                            />
                            {/* Comparison Line (WHO Target) */}
                            <Radar
                                name="Target (100%)"
                                dataKey="fullMark"
                                stroke="#16a34a"
                                strokeWidth={1}
                                strokeDasharray="4 4"
                                fill="none"
                            />
                            <Legend wrapperStyle={{fontSize: '10px'}} />
                        </RadarChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex justify-center mt-2">
                     <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100">
                        Target = 100% RDA
                     </span>
                </div>
            </div>

            {/* Nutrient Trends Chart (Area Chart) */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-700 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-500" /> {t.trends}
                    </h3>
                </div>
                <div className="h-56 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendData}>
                            <defs>
                                <linearGradient id="colorIron" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                </linearGradient>
                                <linearGradient id="colorProtein" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                            <XAxis 
                                dataKey="day" 
                                tick={{fill: '#6b7280'}} 
                                axisLine={false} 
                                tickLine={false} 
                                // Reduce tick density for 30d view
                                interval={progressView === '30d' ? 4 : 0}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                            <Legend />
                            <ReferenceLine y={70} stroke="#16a34a" strokeDasharray="3 3" label={{ position: 'right', value: 'Target', fill: '#16a34a', fontSize: 9 }} />
                            
                            <Area type="monotone" dataKey="iron" name={t.ironTrend} stroke="#ef4444" fillOpacity={1} fill="url(#colorIron)" />
                            <Area type="monotone" dataKey="protein" name={t.proteinTrend} stroke="#f97316" fillOpacity={1} fill="url(#colorProtein)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Calendar Heatmap */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-500" /> {t.calendar}
                </h3>
                <div className="grid grid-cols-7 gap-2">
                    {MOCK_HISTORY.slice(0, 28).map((day, i) => (
                        <div key={i} className={`aspect-square rounded-md flex flex-col items-center justify-center text-[10px] font-bold relative ${
                            day.score === 'good' ? 'bg-green-100 text-green-700' : 
                            day.score === 'average' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                        }`}>
                            <span>{day.date.split('-')[2]}</span>
                            {day.score === 'good' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-0.5"></div>}
                        </div>
                    ))}
                </div>
                <div className="flex gap-4 mt-4 text-[10px] justify-center text-gray-500 font-medium">
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-green-100 rounded"></div> {t.goodDay}</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-yellow-50 rounded"></div> {t.avgDay}</div>
                    <div className="flex items-center gap-1"><div className="w-3 h-3 bg-red-50 rounded"></div> {t.poorDay}</div>
                </div>
            </div>

            {/* Detailed Regional Comparison */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <Map className="w-4 h-4" /> {t.regional}
                </h3>
                <p className="text-xs text-indigo-700 mb-4 leading-relaxed">
                   {t.regionalMsg} <span className="font-bold text-lg text-indigo-900">{MOCK_REGIONAL_STATS.percentile}%</span> {t.similarChildren}
                </p>
                
                {/* Nutrient Balance Comparison */}
                <div className="space-y-4">
                    <div className="bg-white/60 p-3 rounded-lg">
                        <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                            <span>{t.balanceScore} (Iron)</span>
                            <span>{t.betterThan} Avg</span>
                        </div>
                        <div className="h-3 bg-white rounded-full overflow-hidden flex shadow-sm">
                             <div className="bg-gray-300 h-full relative" style={{width: `${MOCK_REGIONAL_STATS.avgIron}%`}}>
                                <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gray-400"></div>
                             </div>
                        </div>
                        <div className="h-2 bg-indigo-200 rounded-full mt-1 overflow-hidden">
                             <div className="h-full bg-indigo-600 rounded-full" style={{width: `${todayStats.iron}%`}}></div>
                        </div>
                    </div>

                    {/* Growth Metrics (Stunting/Wasting) */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase">{t.stunting}</h4>
                            <div className="flex items-end gap-2 mt-1">
                                <span className="text-xl font-bold text-green-600">Top 15%</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1">
                                {t.districtAvg}: <span className="text-red-400">{MOCK_REGIONAL_STATS.stuntingRate}% Risk</span>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100">
                            <h4 className="text-[10px] font-bold text-gray-500 uppercase">{t.wasting}</h4>
                            <div className="flex items-end gap-2 mt-1">
                                <span className="text-xl font-bold text-green-600">Healthy</span>
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1">
                                {t.districtAvg}: <span className="text-orange-400">{MOCK_REGIONAL_STATS.wastingRate}% Risk</span>
                            </div>
                        </div>
                    </div>

                    {/* Dietary Diversity Score */}
                    <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100">
                        <div className="flex justify-between items-center mb-1">
                            <h4 className="text-xs font-bold text-gray-600">{t.diversity} Score</h4>
                            <span className="text-xs font-bold text-indigo-600">5.5 / 7.0</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500" style={{width: `${(5.5/7)*100}%`}}></div>
                        </div>
                        <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                            <span>Child</span>
                            <span>{t.districtAvg}: {MOCK_REGIONAL_STATS.avgDDS}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dietary Diversity Tracker */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-pink-500" /> {t.diversity}
                </h3>
                <div className="flex flex-wrap gap-2 justify-center">
                    {Object.entries(categoryIcons).map(([cat, icon]) => {
                        // Check if eaten today (based on logs or todayStats logic - strictly mocked here for demo of "today")
                        const eaten = logs.some(l => FOOD_DB.find(f => f.id === l.foodId)?.category === cat);
                        return (
                            <div key={cat} className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 transition-all ${
                                eaten ? 'border-green-500 bg-green-50 scale-105' : 'border-gray-100 bg-gray-50 grayscale opacity-50'
                            }`}>
                                <span className="text-2xl">{icon}</span>
                                {eaten && <div className="absolute top-[-5px] right-[-5px] bg-green-500 text-white rounded-full p-0.5"><CheckCircle2 className="w-3 h-3"/></div>}
                            </div>
                        )
                    })}
                </div>
                <p className="text-xs text-center text-gray-500 mt-3">{t.foodGroups} ({t.thisWeek})</p>
            </div>
        </div>
    );
  };

  const renderHome = () => (
    <div className="space-y-8 pb-6 animate-in fade-in duration-300">
      {/* Streak Header - Now Interactive */}
      <div 
        onClick={() => setShowAchievementsModal(true)}
        className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
      >
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-4">
           <Flame className="w-32 h-32" />
        </div>
        <div className="flex justify-between items-center relative z-10 mb-2">
          <div>
            <h2 className="text-lg font-bold opacity-90">{t.streak}</h2>
            <div className="text-4xl font-extrabold flex items-center gap-2">
              {streak} <span className="text-lg font-normal opacity-80">days</span>
            </div>
          </div>
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm animate-pulse">
            <Gift className="w-8 h-8 text-yellow-200" />
          </div>
        </div>
        
        {/* Progress Bar inside Header */}
        <div className="relative z-10">
            <div className="flex justify-between text-[10px] text-brand-100 mb-1 uppercase font-bold">
                <span>Next Kit</span>
                <span>{30 - streak} {language === 'hi' ? 'दिन बाकी' : 'days left'}</span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-yellow-400 rounded-full transition-all duration-1000"
                    style={{ width: `${(streak/30)*100}%` }}
                ></div>
            </div>
        </div>
      </div>

      {/* Badges Preview */}
      <div onClick={() => {setShowAchievementsModal(true); setAchievementsTab('social')}} className="cursor-pointer">
        <div className="flex justify-between items-center mb-3 px-1">
            <h3 className="font-bold text-gray-700 flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-500" /> {t.badges}
            </h3>
            <span className="text-xs text-brand-600 font-semibold flex items-center">View All <ChevronRight className="w-3 h-3" /></span>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {MOCK_BADGES.slice(0, 4).map(badge => (
                    <div key={badge.id} className={`min-w-[80px] flex flex-col items-center p-2 rounded-lg ${badge.unlocked ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                        <div className={`text-3xl mb-1 ${badge.unlocked ? 'scale-100' : 'scale-90'}`}>{badge.icon}</div>
                        <div className="text-[9px] font-bold text-center leading-tight truncate w-full">{language === 'hi' ? badge.nameHi : badge.nameEn}</div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Nutrition Summary */}
      <div className="relative">
          <NutritionChart data={todayStats} language={language} />
          {/* Link to detailed stats */}
          <button 
            onClick={() => setActiveTab('progress')}
            className="absolute top-2 right-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1 hover:bg-gray-200"
          >
             {t.stats} <ChevronRight className="w-3 h-3" />
          </button>
      </div>

      {/* Bottle Safety Checklist */}
      <div className="bg-white rounded-xl shadow-sm border border-blue-100 overflow-hidden">
        <div className="bg-blue-50 p-3 border-b border-blue-100 flex items-center gap-2">
          <div className="bg-white p-1.5 rounded-full shadow-sm text-lg">🍼</div>
          <h3 className="font-bold text-blue-900">{t.bottleSafety}</h3>
        </div>
        <div className="divide-y divide-gray-50">
          {BOTTLE_SAFETY_STEPS.map(step => {
             const isChecked = checkedSafetySteps.has(step.id);
             return (
               <div key={step.id} className="p-3 transition-colors hover:bg-gray-50" onClick={() => toggleSafetyStep(step.id)}>
                 <div className="flex items-start gap-3">
                   <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors cursor-pointer ${isChecked ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                         <span className="text-lg">{step.icon}</span>
                         <p className={`font-semibold text-sm text-gray-800 ${isChecked ? 'line-through text-gray-400' : ''}`}>
                            {language === 'hi' ? step.stepHi : step.stepEn}
                         </p>
                      </div>
                      {!isChecked && (
                        <div className="flex items-start gap-1.5 mt-1 bg-red-50 p-2 rounded-lg border border-red-100">
                           <AlertTriangle className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                           <p className="text-[10px] text-red-600 font-medium leading-tight">
                              <span className="font-bold uppercase">{t.risk}:</span> {language === 'hi' ? step.riskHi : step.riskEn}
                           </p>
                        </div>
                      )}
                   </div>
                 </div>
               </div>
             );
          })}
        </div>
      </div>

      {/* Feeding Guide Teaser (Click to go to Meals Tab) */}
      <div 
        onClick={() => setActiveTab('meals')}
        className="bg-orange-50 rounded-xl p-4 border border-orange-100 flex items-center justify-between cursor-pointer active:bg-orange-100 transition-colors"
      >
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-xl">
                  🥣
              </div>
              <div>
                  <h3 className="font-bold text-orange-900">{t.recommendations}</h3>
                  <p className="text-xs text-orange-700">{t.recommendationSubtitle}</p>
              </div>
          </div>
          <ChevronRight className="w-5 h-5 text-orange-400" />
      </div>

      {/* Myth Buster Module */}
      <div className="bg-purple-50/50 rounded-2xl p-4 border border-purple-100">
        {renderMythBuster()}
      </div>

      {/* Community Board */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
         <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
           <Users className="w-5 h-5" />
           {t.community}
         </h3>
         <div className="space-y-3">
            <div className="bg-white p-3 rounded-lg shadow-sm flex gap-3 items-center">
                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                    <Calendar className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-semibold text-gray-800 text-sm">Polio Vaccination Camp</p>
                    <p className="text-xs text-gray-500">Friday, 10 AM @ Community Hall</p>
                </div>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm flex gap-3 items-center">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg">
                    <Users className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-semibold text-gray-800 text-sm">Mother's Group Meeting</p>
                    <p className="text-xs text-gray-500">Saturday, 4 PM @ Anganwadi Center</p>
                </div>
            </div>
         </div>
      </div>

      {/* Today's Logs Preview */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex justify-between items-center mb-4">
           <h3 className="font-bold text-gray-700">{t.logFood}</h3>
           <button onClick={() => setActiveTab('log')} className="bg-brand-50 text-brand-600 p-2 rounded-full shadow-sm hover:bg-brand-100">
             <Plus className="w-5 h-5" />
           </button>
        </div>
        {logs.length === 0 ? (
           <div className="text-center py-6 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">
             {language === 'hi' ? 'अभी तक कोई खाना नहीं जोड़ा गया।' : 'No food logged yet.'}
           </div>
        ) : (
          <div className="space-y-3">
             {logs.map((log, idx) => {
               const food = FOOD_DB.find(f => f.id === log.foodId);
               return (
                 <div key={idx} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0">
                    <div className="flex items-center gap-3">
                       <span className="text-2xl">{food?.icon}</span>
                       <div>
                         <p className="font-medium text-gray-800">{language === 'hi' ? food?.nameHi : food?.nameEn}</p>
                         <p className="text-xs text-gray-500">{log.quantity} x {t[log.unit]}</p>
                       </div>
                    </div>
                 </div>
               );
             })}
          </div>
        )}
      </div>
    </div>
  );

  const renderLog = () => (
    <div className="h-full bg-gray-50 flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-4 bg-white shadow-sm z-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t.logFood}</h2>
        {/* Search/Category Filter could go here */}
        
        {/* Selected Food Preview */}
        {selectedFood && (
          <div className="mb-4 bg-brand-50 border border-brand-100 p-3 rounded-xl flex justify-between items-center animate-in zoom-in-95">
             <div className="flex items-center gap-3">
               <span className="text-3xl">{selectedFood.icon}</span>
               <div>
                 <div className="font-bold text-brand-900">{language === 'hi' ? selectedFood.nameHi : selectedFood.nameEn}</div>
                 <div className="text-xs text-brand-600">Iron: {selectedFood.nutrients.iron}% • Protein: {selectedFood.nutrients.protein}%</div>
               </div>
             </div>
             <button onClick={() => setSelectedFood(null)} className="p-1 hover:bg-brand-100 rounded-full">
               <X className="w-5 h-5 text-brand-700" />
             </button>
          </div>
        )}

        {/* Quantity Inputs if food selected */}
        {selectedFood ? (
           <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">{t.selectUnit}</label>
                <div className="grid grid-cols-4 gap-2">
                  {['katori', 'spoon', 'glass', 'piece'].map((u) => (
                    <button 
                      key={u}
                      onClick={() => setUnit(u as any)}
                      className={`p-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1 transition-all ${unit === u ? 'bg-brand-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {/* Icons for units could vary, using simple text/emoji for now */}
                      <span className="text-lg">{u === 'katori' ? '🥣' : u === 'spoon' ? '🥄' : u === 'glass' ? '🥛' : '🍎'}</span>
                      {t[u as keyof typeof t]}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="flex-1">
                   <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Quantity: {quantity}</label>
                   <input 
                     type="range" 
                     min="0.5" 
                     max="5" 
                     step="0.5" 
                     value={quantity}
                     onChange={(e) => setQuantity(parseFloat(e.target.value))}
                     className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                   />
                 </div>
                 <button 
                   onClick={handleAddFood}
                   className="bg-brand-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center gap-2"
                 >
                   <Plus className="w-5 h-5" /> {t.add}
                 </button>
              </div>
           </div>
        ) : (
           <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input type="text" placeholder="Search roti, dal, milk..." className="w-full pl-10 p-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all" />
           </div>
        )}
      </div>

      {/* Food Grid */}
      <div className="flex-1 overflow-y-auto p-4">
         <div className="grid grid-cols-2 gap-3">
            {FOOD_DB.map(food => (
              <button 
                key={food.id}
                onClick={() => setSelectedFood(food)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${selectedFood?.id === food.id ? 'border-brand-500 bg-brand-50' : 'border-transparent bg-white shadow-sm hover:border-brand-200'}`}
              >
                 <div className="text-3xl mb-2">{food.icon}</div>
                 <div className="font-bold text-gray-800 leading-tight">{language === 'hi' ? food.nameHi : food.nameEn}</div>
                 <div className="text-[10px] text-gray-500 mt-1 uppercase tracking-wide font-bold text-brand-600">{food.category}</div>
              </button>
            ))}
         </div>
      </div>
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full bg-white animate-in fade-in duration-300">
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatHistory.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-brand-500 text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                   {msg.text}
                </div>
             </div>
          ))}
          {isChatLoading && (
             <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-none text-gray-500 text-sm animate-pulse">
                   Thinking...
                </div>
             </div>
          )}
       </div>
       <div className="p-4 border-t border-gray-100 flex gap-2 items-center bg-gray-50">
          <button 
             onClick={simulateVoiceInput}
             className={`p-3 rounded-full transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-600'}`}
          >
             <Mic className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
             <input 
               type="text" 
               value={chatQuery}
               onChange={(e) => setChatQuery(e.target.value)}
               placeholder={t.chatPlaceholder}
               className="w-full pl-4 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
               onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
             />
          </div>
          <button 
             onClick={handleSendMessage}
             disabled={!chatQuery.trim() || isChatLoading}
             className="p-3 bg-brand-500 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-600 transition-colors"
          >
             <Send className="w-5 h-5" />
          </button>
       </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="flex-none bg-white p-4 shadow-sm z-20 flex justify-between items-center">
        <div>
           <h1 className="text-xl font-bold text-brand-700">{myChild.name}'s Journey</h1>
           <p className="text-xs text-gray-500">{t.streak}: {streak} Days 🔥</p>
        </div>
        <button onClick={() => setShowChildProfile(true)} className="w-10 h-10 bg-brand-100 rounded-full border-2 border-white shadow-sm overflow-hidden">
           <div className="w-full h-full flex items-center justify-center text-xl">👶</div>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-20">
         {activeTab === 'home' && renderHome()}
         {activeTab === 'meals' && renderMealsTab()}
         {activeTab === 'log' && renderLog()}
         {activeTab === 'progress' && renderProgress()}
         {activeTab === 'coach' && renderEbfCoachTab()}
         {activeTab === 'chat' && renderChat()}
      </div>

      <nav className="flex-none bg-white border-t border-gray-200 py-2 px-4 flex justify-between items-center z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === 'home' ? 'text-brand-600 bg-brand-50' : 'text-gray-400'}`}>
           <LayoutDashboard className="w-5 h-5" />
           <span className="text-[10px] font-bold">{t.dashboard}</span>
        </button>
        <button onClick={() => setActiveTab('meals')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === 'meals' ? 'text-brand-600 bg-brand-50' : 'text-gray-400'}`}>
           <Utensils className="w-5 h-5" />
           <span className="text-[10px] font-bold">{t.meals}</span>
        </button>
        <button onClick={() => setActiveTab('log')} className="flex flex-col items-center gap-1 -mt-8">
           <div className="w-14 h-14 bg-brand-600 rounded-full shadow-lg flex items-center justify-center text-white border-4 border-gray-50 active:scale-95 transition-transform">
              <Plus className="w-6 h-6" />
           </div>
           <span className="text-[10px] font-bold text-gray-500">{t.add}</span>
        </button>
        <button onClick={() => setActiveTab('progress')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === 'progress' ? 'text-brand-600 bg-brand-50' : 'text-gray-400'}`}>
           <BarChart2 className="w-5 h-5" />
           <span className="text-[10px] font-bold">{t.stats}</span>
        </button>
        <button onClick={() => setActiveTab('coach')} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${activeTab === 'coach' ? 'text-brand-600 bg-brand-50' : 'text-gray-400'}`}>
           <Baby className="w-5 h-5" />
           <span className="text-[10px] font-bold">{t.coach}</span>
        </button>
      </nav>

      {/* Floating Chat Button (Ask Didi) - visible unless in chat tab */}
      {activeTab !== 'chat' && (
        <button 
           onClick={() => setActiveTab('chat')}
           className="absolute bottom-20 right-4 bg-purple-600 text-white p-3 rounded-full shadow-lg border-2 border-white flex items-center justify-center gap-2 z-30 animate-bounce-subtle"
        >
           <MessageCircle className="w-6 h-6" />
           <span className="text-xs font-bold pr-1">{t.askDidi}</span>
        </button>
      )}

      {/* Modals */}
      <RecipeModal />
      <AchievementsModal />
      <QRModal />
      <ChildProfileModal />
    </div>
  );
};

export default ParentDashboard;