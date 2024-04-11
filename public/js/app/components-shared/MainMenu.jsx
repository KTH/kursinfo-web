import React from 'react'

export const MainMenuMobileDialog = ({ children }) => (
  <dialog className="kth-mobile-menu left">
    <div className="kth-mobile-menu__navigation">
      <button className="kth-icon-button close">
        <span className="kth-visually-hidden">Close</span>
      </button>
    </div>
    <div className="mobile-menu__content">{children}</div>
  </dialog>
)

export const MainMenu = ({ children, title, ancestorItem }) => {
  const mobileId = 'kth-local-navigation-title--mobile'
  const desktopId = 'local-navigation-title'
  return (
    <>
      <nav className="kth-local-navigation--mobile" aria-labelledby={mobileId}>
        <button className="kth-button menu" id={mobileId}>
          <span>{title}</span>
        </button>
        <MainMenuMobileDialog>
          <a href={ancestorItem.href} className="kth-button back">
            {ancestorItem.label}
          </a>
          <h2>{title}</h2>
          {children}
        </MainMenuMobileDialog>
      </nav>

      <nav id="mainMenu" className="kth-local-navigation col" aria-labelledby={desktopId}>
        <a href={ancestorItem.href} className="kth-button back">
          {ancestorItem.label}
        </a>
        <h2 id={desktopId}>{title}</h2>
        {children}
      </nav>
    </>
  )
}
