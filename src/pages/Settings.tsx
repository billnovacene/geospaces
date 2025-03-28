
import React, { useState } from "react";
import { SidebarWrapper } from "@/components/Dashboard/SidebarWrapper";
import { SettingsHeader } from "./settings/SettingsHeader";
import { SettingsTabs } from "./settings/SettingsTabs";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("typography");

  return (
    <SidebarWrapper>
      <div className="flex-1 overflow-auto bg-background min-h-screen">
        <div className="container mx-auto py-6 px-4 md:px-6">
          <SettingsHeader />
          <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </SidebarWrapper>
  );
};

export default Settings;
