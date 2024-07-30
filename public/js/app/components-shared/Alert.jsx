/**
 * https://intra.kth.se/style/en/components/alert
 *
 * Changelog:
 * - 2024-04- - initial version (release of kth-style 10 public apps)
 * - 2024-05-31 - add aria-live="polite" as default and add {...rest} to allow adding extra props (as test-ids) to Alert root element
 * - 2024-06-03 - add support for classname prop
 * - 2024-07-25 - remove use of deprecated "defaultProps" from prop-types
 */
import React from 'react'
import PropTypes from 'prop-types'

const Alert = ({ type = 'info', header, children, className, ...rest }) => (
  <div className={`kth-alert ${type} ${className ?? ''}`} role="alert" aria-live="polite" {...rest}>
    {header && <h4>{header}</h4>}
    <div>{children}</div>
  </div>
)

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  header: PropTypes.node,
  type: PropTypes.oneOf(['info', 'warning', 'success']).isRequired,
}

export default Alert
