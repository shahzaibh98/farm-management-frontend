import React from 'react';
import { Tabs } from '@mantine/core';

interface TabData {
  value: string;
  label: string;
  icon?: React.ReactNode;
  component: React.ReactNode;
}

interface TabsProps {
  tabs: TabData[];
  tabsProps?: any;
  listProps?: any;
  panelProps?: any;
  tabProps?: any;
}

const CustomTabs = ({
  tabs,
  tabsProps,
  listProps,
  panelProps,
  tabProps,
}: TabsProps) => {
  return (
    <Tabs {...tabsProps} defaultValue={tabs[0].value}>
      <Tabs.List {...listProps}>
        {tabs.map(tab => (
          <Tabs.Tab
            key={tab.value}
            value={tab.value}
            leftSection={tab.icon}
            {...tabProps}
          >
            <div className="text-lg"> {tab.label}</div>
          </Tabs.Tab>
        ))}
      </Tabs.List>

      {tabs.map(tab => (
        <Tabs.Panel key={tab.value} value={tab.value} {...panelProps}>
          {tab.component}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};

export default CustomTabs;
