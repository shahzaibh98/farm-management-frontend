import React from 'react';
import { Tabs as MantineTabs } from '@mantine/core';

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

const Tabs = ({
  tabs,
  tabsProps,
  listProps,
  panelProps,
  tabProps,
}: TabsProps) => {
  return (
    <MantineTabs {...tabsProps} defaultValue={tabs[0].value}>
      <MantineTabs.List {...listProps}>
        {tabs.map(tab => (
          <MantineTabs.Tab
            key={tab.value}
            value={tab.value}
            leftSection={tab.icon}
            {...tabProps}
          >
            <div className="text-lg"> {tab.label}</div>
          </MantineTabs.Tab>
        ))}
      </MantineTabs.List>

      {tabs.map(tab => (
        <MantineTabs.Panel key={tab.value} value={tab.value} {...panelProps}>
          {tab.component}
        </MantineTabs.Panel>
      ))}
    </MantineTabs>
  );
};

export default Tabs;
