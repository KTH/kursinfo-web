import React from 'react'

function SideMenuMobile({ title, children }) {
  return (
    <nav className="kth-local-navigation--mobile" aria-labelledby="kth-local-navigation-title--mobile">
      <button className="kth-button menu" id="kth-local-navigation-title--mobile">
        <span>{title}</span>
      </button>
      <dialog className="kth-mobile-menu left">
        <div className="kth-mobile-menu__navigation">
          <button className="kth-icon-button close">
            <span className="kth-visually-hidden">Close</span>
          </button>
        </div>
        <div className="mobile-menu__content">{children}</div>
      </dialog>
    </nav>
  )
}

export default SideMenuMobile
