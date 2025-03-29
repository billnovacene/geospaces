
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FilterNotificationBanner } from "./components/FilterNotificationBanner";
import { MonthlyDataDescription } from "./components/MonthlyDataDescription";
import { RiskAssessmentTable } from "./components/RiskAssessmentTable";
import { DailyRiskSummary } from "./components/DailyRiskSummary";
import { useDampMold } from "./context/DampMoldContext";
import { fetchSites } from "@/services/sites";
import { fetchZones } from "@/services/zones";

interface RiskGlanceSectionProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  timeRange: string;
  setTimeRange: (value: string) => void;
  monthlyRiskData: any[];
  activeFilter?: string | null;
}

export function RiskGlanceSection({
  activeTab,
  setActiveTab,
  timeRange,
  setTimeRange,
  monthlyRiskData,
  activeFilter = null
}: RiskGlanceSectionProps) {
  const { contextInfo } = useDampMold();
  const [enrichedRiskData, setEnrichedRiskData] = useState(monthlyRiskData);
  
  // Fetch site and zone names to enrich the risk data
  useEffect(() => {
    const enrichData = async () => {
      if (!monthlyRiskData || monthlyRiskData.length === 0) {
        setEnrichedRiskData([]);
        return;
      }
      
      // Get unique site IDs
      const siteIds = [...new Set(monthlyRiskData
        .map(item => item.siteId)
        .filter(id => id !== 'undefined')
        .map(id => Number(id)))]
        .filter(id => !isNaN(id));
      
      // Get unique zone IDs
      const zoneIds = [...new Set(monthlyRiskData
        .map(item => item.zoneId)
        .filter(id => id !== 'undefined')
        .map(id => Number(id)))]
        .filter(id => !isNaN(id));
      
      // Fetch site and zone data
      const sitesPromise = siteIds.length > 0 ? Promise.all(siteIds.map(id => fetchSites(145).then(sites => sites.find(site => site.id === id)))) : Promise.resolve([]);
      const zonesPromise = zoneIds.length > 0 ? Promise.all(zoneIds.map(id => fetchZones(Number(contextInfo.siteId)).then(zones => zones.find(zone => zone.id === id)))) : Promise.resolve([]);
      
      try {
        const [sites, zones] = await Promise.all([sitesPromise, zonesPromise]);
        
        // Create lookup maps
        const siteMap = new Map();
        const zoneMap = new Map();
        
        sites.forEach(site => {
          if (site) siteMap.set(site.id.toString(), site.name);
        });
        
        zones.forEach(zone => {
          if (zone) zoneMap.set(zone.id.toString(), zone.name);
        });
        
        // Enrich the risk data with actual names
        const enriched = monthlyRiskData.map(item => {
          const siteName = siteMap.get(item.siteId) || item.building;
          const zoneName = zoneMap.get(item.zoneId) || item.zone;
          
          return {
            ...item,
            building: siteName,
            zone: zoneName
          };
        });
        
        setEnrichedRiskData(enriched);
      } catch (err) {
        console.error("Error enriching risk data:", err);
        setEnrichedRiskData(monthlyRiskData);
      }
    };
    
    enrichData();
  }, [monthlyRiskData, contextInfo.siteId]);
  
  // Filter data based on active filter
  const filteredData = activeFilter ? enrichedRiskData.filter(row => {
    switch (activeFilter) {
      case 'high-risk':
        return row.overallRisk === 'Alarm';
      case 'caution':
        return row.overallRisk === 'Caution';
      case 'normal':
        return row.overallRisk === 'Good';
      default:
        return true;
    }
  }) : enrichedRiskData;

  return (
    <Card className="shadow-sm mb-10 w-full dark:bg-gray-800 dark:border-gray-700">
      <FilterNotificationBanner activeFilter={activeFilter} />
      
      <CardContent className="w-full py-8">
        {activeTab === "today" ? (
          <DailyRiskSummary data={null} />
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <MonthlyDataDescription activeFilter={activeFilter} />
            <RiskAssessmentTable data={filteredData} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
