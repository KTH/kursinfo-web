import React from 'react'

import { TabGroup, Tab as TabLisstItem, TabList, TabPanel, TabPanels } from '@headlessui/react'

// TODO(karl): skriv doc/kommentar
export const Tab = ({ children }) => <>{children}</>

export const Tabs = ({ children, selectedTabKey, onSelectedTabChange }) => {
  const onSelectedIndexChange = index => {
    const newKey = children[index].props.tabKey
    onSelectedTabChange(newKey)
  }
  const selectedIndex = children.findIndex(x => x.props.tabKey === `${selectedTabKey}`) ?? 0

  return (
    <TabGroup className="tabs" selectedIndex={selectedIndex} onChange={onSelectedIndexChange}>
      <TabList role="tablist">
        {children.map(tab => (
          <TabLisstItem key={tab.props.tabKey} type="button">
            {tab.props.title}
          </TabLisstItem>
        ))}
      </TabList>
      <TabPanels>
        {children.map(tab => (
          <TabPanel key={tab.props.tabKey}>{tab}</TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  )
}
