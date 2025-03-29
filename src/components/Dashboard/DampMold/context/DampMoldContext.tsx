
import React, { createContext, useContext } from "react";
import { TempHumidityResponse } from "@/services/interfaces/temp-humidity";
import { useDampMoldData, DampMoldContextInfo } from "../hooks/useDampMoldData";

interface DampMoldProviderProps {
  children: React.ReactNode;
  contextType?: "zone" | "site" | "all";
  contextId?: string | null;
  siteId?: string;
  zoneId?: string;
  activeFilter?: string | null;
  currentDate?: Date;
}

interface DampMoldContextType {
  contextInfo: DampMoldContextInfo;
  data: TempHumidityResponse;
  isLoading: boolean;
  error: Error | null;
  activeFilter: string | null;
  currentDate: Date;
}

const DampMoldContext = createContext<DampMoldContextType | undefined>(undefined);

export function DampMoldProvider({
  children,
  contextType: propsContextType,
  contextId: propsContextId,
  siteId: propsSiteId,
  zoneId: propsZoneId,
  activeFilter = null,
  currentDate = new Date()
}: DampMoldProviderProps) {
  // Use the custom hook to fetch data and determine context
  const { 
    contextInfo, 
    data, 
    isLoading, 
    error 
  } = useDampMoldData(
    propsContextType,
    propsContextId,
    propsSiteId,
    propsZoneId,
    activeFilter
  );

  const contextValue: DampMoldContextType = {
    contextInfo,
    data,
    isLoading,
    error,
    activeFilter,
    currentDate
  };

  return (
    <DampMoldContext.Provider value={contextValue}>
      {children}
    </DampMoldContext.Provider>
  );
}

export function useDampMold() {
  const context = useContext(DampMoldContext);
  
  if (context === undefined) {
    throw new Error("useDampMold must be used within a DampMoldProvider");
  }
  
  return context;
}
