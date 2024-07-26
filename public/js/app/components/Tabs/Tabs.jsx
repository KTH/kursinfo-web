import React from 'react'
import PropTypes from 'prop-types'

import { TabGroup, Tab as TabLisstItem, TabList, TabPanel, TabPanels } from '@headlessui/react'

const warnIfChildrenAreInvalid = children => {
  for (const tab of children) {
    if (typeof tab.type !== 'function') {
      // eslint-disable-next-line no-console
      console.warn(`invalid children in <Tabs>: ${tab.type}`)
    }
    if (tab.type.name !== 'Tab') {
      // eslint-disable-next-line no-console
      console.warn(`invalid children in <Tabs>: ${tab.type.name}`)
    }
  }
  const keys = children.map(x => x.props.tabKey)
  if (new Set(keys).size !== keys.length) {
    // eslint-disable-next-line no-console
    console.warn(`invalid <Tabs>, tabKeys must be unique: ${keys.join(', ')}`)
  }
}

/**
 * <Tab> should be used as child of <Tabs>. Must have unique tabKey props
 */
export const Tab = ({ children }) => <>{children}</>
Tab.propTypes = {
  tabKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
}

/**
 * children should allways list of <Tab>s with unique 'tabKey' prop.
 * <Tab> with 'tabKey' === 'selectedTabKey' will be rendered.
 */
export const Tabs = ({ children, selectedTabKey, onSelectedTabChange }) => {
  // Do not render tabs single children/tab
  if (children.length === 1) {
    return <div>{children[0]}</div>
  }
  warnIfChildrenAreInvalid(children)

  const onSelectedIndexChange = index => {
    const newKey = children[index].props.tabKey
    onSelectedTabChange(newKey)
  }
  const selectedIndex = children.findIndex(x => `${x.props.tabKey}` === `${selectedTabKey}`) ?? 0

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
Tabs.propTypes = {
  selectedTabKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSelectedTabChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
}
