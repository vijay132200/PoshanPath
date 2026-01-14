import React, { useState, useEffect, useRef } from 'react';
import { MOCK_ALERTS, MOCK_CHILDREN, MOCK_INVENTORY, TRANSLATIONS, getWhoStandard } from '../constants';
import { Language, ChildProfile } from '../types';
import { MapPin, AlertTriangle, CheckCircle, Activity, LayoutDashboard, Users, Package, X, Syringe, ClipboardList, ToggleLeft, ToggleRight, Baby } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// OpenLayers Imports
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import OSM from 'ol/source/OSM';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Circle as CircleStyle, Fill, Stroke } from 'ol/style';
import Overlay from 'ol/Overlay';

interface Props {
  language: Language;
}

const WorkerDashboard: React.FC<Props> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'dashboard' | 'children' | 'inventory'>('dashboard');
  const [selectedChild, setSelectedChild] = useState<ChildProfile | null>(null);
  const [showVisitSuccess, setShowVisitSuccess] = useState(false);

  // Map Refs
  const mapElement = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'dashboard' && mapElement.current && !mapRef.current) {
      // 1. Initialize Source and Vector Layer for markers
      const vectorSource = new VectorSource();
      
      MOCK_CHILDREN.forEach(child => {
        if (child.location) {
          const feature = new Feature({
            geometry: new Point(fromLonLat([child.location.lng, child.location.lat])),
            childId: child.id,
            riskLevel: child.riskLevel,
            name: child.name
          });

          // Style based on risk
          const color = child.riskLevel === 'high' ? '#ef4444' : child.riskLevel === 'medium' ? '#facc15' : '#22c55e';
          
          feature.setStyle(new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color: color }),
              stroke: new Stroke({ color: '#fff', width: 2 })
            })
          }));
          
          vectorSource.addFeature(feature);
        }
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource
      });

      // 2. Initialize Overlay for Popup
      const overlay = new Overlay({
        element: popupRef.current!,
        autoPan: {
            animation: {
                duration: 250,
            },
        },
      });

      // 3. Initialize Map (Centered on Kotma, MP)
      const map = new Map({
        target: mapElement.current,
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          vectorLayer
        ],
        view: new View({
          center: fromLonLat([81.9620, 23.2030]), // Kotma, MP Coordinates
          zoom: 13 // Zoom level appropriate for a village/town view
        }),
        overlays: [overlay]
      });

      // 4. Interaction (Click)
      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature);
        if (feature) {
            const childId = feature.get('childId');
            const child = MOCK_CHILDREN.find(c => c.id === childId);
            if(child) setSelectedChild(child);
        }
      });

      mapRef.current = map;
    }

    // Cleanup
    return () => {
        if (activeTab !== 'dashboard' && mapRef.current) {
            mapRef.current.setTarget(undefined);
            mapRef.current = null;
        }
    }
  }, [activeTab]);


  const handleRecordVisit = () => {
    setShowVisitSuccess(true);
    setTimeout(() => {
        setShowVisitSuccess(false);
        setSelectedChild(null);
    }, 2000);
  };

  // --- Sub-Components ---

  const ChildDetailModal = () => {
    const [showWhoCurve, setShowWhoCurve] = useState(false);
    
    if (!selectedChild) return null;

    const chartData = selectedChild.weightHistory.length > 0 
        ? selectedChild.weightHistory.map(h => ({...h, standard: getWhoStandard(selectedChild.gender, h.month)}))
        : [];

    return (
      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
        <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
           <div className="sticky top-0 bg-white p-4 border-b border-gray-100 flex justify-between items-center z-10">
             <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedChild.name}</h2>
                <p className="text-sm text-gray-500">{selectedChild.ageMonths} {t.age} • {selectedChild.gender === 'M' ? 'Male' : 'Female'}</p>
             </div>
             <button onClick={() => setSelectedChild(null)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
               <X className="w-5 h-5 text-gray-600" />
             </button>
           </div>
           
           <div className="p-4 space-y-6">
             {/* Status Banner */}
             <div className={`p-3 rounded-lg flex items-center gap-3 ${selectedChild.riskLevel === 'high' ? 'bg-red-50 text-red-700' : selectedChild.riskLevel === 'medium' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                <Activity className="w-5 h-5" />
                <span className="font-semibold uppercase text-sm">{selectedChild.riskLevel} Risk Status</span>
             </div>

             {/* Growth Chart */}
             {chartData.length > 0 ? (
                 <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> {t.growthChart}
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
                        <YAxis domain={['dataMin - 1', 'dataMax + 1']} tick={{fontSize: 10}} width={30} />
                        <Tooltip />
                        {showWhoCurve && (
                                <Line type="monotone" dataKey="standard" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                            )}
                        <Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={3} dot={{r: 4, fill: '#f97316'}} />
                        </LineChart>
                    </ResponsiveContainer>
                    </div>
                 </div>
             ) : (
                <div className="bg-gray-50 p-4 text-center text-gray-500 text-sm rounded-lg">No growth history available.</div>
             )}

             {/* Key Deficiencies */}
             <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Nutrient Gaps (Last 30 Days)</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-red-50 p-2 rounded border border-red-100">
                        <div className="text-xs text-red-500">Iron</div>
                        <div className="font-bold text-red-700">{selectedChild.nutritionStatus.iron.toFixed(0)}%</div>
                    </div>
                    <div className="bg-orange-50 p-2 rounded border border-orange-100">
                        <div className="text-xs text-orange-500">Protein</div>
                        <div className="font-bold text-orange-700">{selectedChild.nutritionStatus.protein.toFixed(0)}%</div>
                    </div>
                </div>
             </div>

             {/* Actions */}
             <div className="grid grid-cols-2 gap-3 pt-2">
                <button onClick={handleRecordVisit} className="bg-brand-600 text-white py-3 rounded-lg font-semibold shadow-md flex items-center justify-center gap-2 active:scale-95 transition-transform">
                   <ClipboardList className="w-4 h-4" /> {t.recordVisit}
                </button>
                <button className="bg-blue-50 text-blue-600 py-3 rounded-lg font-semibold border border-blue-200 flex items-center justify-center gap-2">
                   <Syringe className="w-4 h-4" /> Vaccination
                </button>
             </div>
           </div>
        </div>
        {/* Success Toast */}
        {showVisitSuccess && (
            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-in slide-in-from-bottom-5 z-[60]">
                <CheckCircle className="w-4 h-4" /> Visit Recorded Successfully
            </div>
        )}
      </div>
    );
  };

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-300">
       {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-100 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-green-700">65%</div>
          <div className="text-xs text-green-600">On Track</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-yellow-700">25%</div>
          <div className="text-xs text-yellow-600">At Risk</div>
        </div>
        <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-center">
          <div className="text-xl font-bold text-red-700">10%</div>
          <div className="text-xs text-red-600">Critical</div>
        </div>
      </div>

      {/* Risk Map (OpenLayers) */}
      <div className="relative w-full h-80 bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200">
        <div ref={mapElement} className="map-container w-full h-full"></div>
        {/* Hidden popup container used by OpenLayers Overlay */}
        <div ref={popupRef} className="ol-popup hidden"></div>
        
        <div className="absolute top-2 left-2 bg-white/90 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 z-10 shadow-sm border border-gray-100 backdrop-blur-sm">
          {t.riskMap} (Kotma, MP)
        </div>
        <div className="absolute bottom-2 right-2 bg-white/90 p-2 rounded-lg text-[10px] space-y-1 shadow-md border border-gray-100 backdrop-blur-sm z-10">
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div> Safe</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-yellow-400 rounded-full border border-white"></div> Monitor</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></div> Urgent</div>
        </div>
      </div>

      {/* Priority Alerts */}
      <div>
        <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          {t.alerts}
        </h2>
        <div className="space-y-3">
          {MOCK_ALERTS.map(alert => (
            <div key={alert.id} className={`p-4 rounded-lg border-l-4 shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors ${alert.severity === 'critical' ? 'border-l-red-500' : alert.severity === 'high' ? 'border-l-red-400' : 'border-l-yellow-400'}`}
                onClick={() => {
                    const child = MOCK_CHILDREN.find(c => c.id === alert.childId);
                    if (child) setSelectedChild(child);
                }}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-800">{alert.childName}</h3>
                  {alert.type === 'ebf_risk' && (
                     <span className="bg-pink-100 text-pink-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                       <Baby className="w-3 h-3" /> EBF
                     </span>
                  )}
                </div>
                <span className="text-xs text-slate-400">{alert.date}</span>
              </div>
              <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
              <div className="mt-2 text-xs font-semibold text-brand-600 flex items-center gap-1">
                 Tap to view actions <LayoutDashboard className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderChildrenList = () => (
    <div className="animate-in fade-in duration-300">
        <h2 className="text-lg font-bold text-slate-800 mb-4">{t.children} ({MOCK_CHILDREN.length})</h2>
        <div className="bg-white rounded-lg shadow-sm divide-y divide-slate-100">
          {MOCK_CHILDREN.map(child => (
            <div key={child.id} onClick={() => setSelectedChild(child)} className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${child.riskLevel === 'high' ? 'bg-red-500' : child.riskLevel === 'medium' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
                <div>
                  <div className="font-medium text-slate-800">{child.name}</div>
                  <div className="text-xs text-slate-500">{child.ageMonths} months • ID: #{child.id.toUpperCase()}</div>
                </div>
              </div>
              <div className="text-brand-600 bg-brand-50 p-2 rounded-full">
                 <Activity className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
    </div>
  );

  const renderInventory = () => (
      <div className="animate-in fade-in duration-300 space-y-4">
          <h2 className="text-lg font-bold text-slate-800 mb-2">{t.inventory}</h2>
          {MOCK_INVENTORY.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                  <div>
                      <h3 className="font-semibold text-gray-800">{language === 'hi' ? item.nameHi : item.nameEn}</h3>
                      <p className={`text-xs mt-1 ${item.quantity <= item.lowStockThreshold ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                          {item.quantity} {item.unit} left
                          {item.quantity <= item.lowStockThreshold && ` • ${t.lowStock}`}
                      </p>
                  </div>
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg hover:bg-gray-200">
                      Request
                  </button>
              </div>
          ))}
          <div className="p-4 bg-brand-50 rounded-xl border border-brand-100 mt-4">
              <h3 className="font-semibold text-brand-800 text-sm mb-2">Next Delivery</h3>
              <p className="text-xs text-brand-600">Expected on Friday, 28th Oct. Includes IFA syrup and THR packets.</p>
          </div>
      </div>
  );

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <header className="flex-none flex justify-between items-center p-4 bg-white shadow-sm z-10">
        <div>
          <h1 className="text-xl font-bold text-slate-800">{t.worker}</h1>
          <p className="text-sm text-slate-500">Center #402, Kotma</p>
        </div>
        <div className="bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-semibold">
          {MOCK_CHILDREN.length} Kids
        </div>
      </header>

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide pb-20">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'children' && renderChildrenList()}
        {activeTab === 'inventory' && renderInventory()}
      </div>

      {/* Bottom Nav for Worker */}
      <div className="flex-none bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center z-40 shadow-lg">
        <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-brand-600' : 'text-gray-400'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.dashboard}</span>
        </button>
        <button onClick={() => setActiveTab('children')} className={`flex flex-col items-center gap-1 ${activeTab === 'children' ? 'text-brand-600' : 'text-gray-400'}`}>
          <Users className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.children}</span>
        </button>
        <button onClick={() => setActiveTab('inventory')} className={`flex flex-col items-center gap-1 ${activeTab === 'inventory' ? 'text-brand-600' : 'text-gray-400'}`}>
          <Package className="w-5 h-5" />
          <span className="text-[10px] font-medium">{t.inventory}</span>
        </button>
      </div>

      <ChildDetailModal />
    </div>
  );
};

export default WorkerDashboard;