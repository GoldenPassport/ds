// Golden Passport — Sidebar (Tailwind v4)

function Sidebar({ active, onNav, collapsed }) {
  const navItems = [
    { id: 'dashboard',    icon: '⬡', label: 'Dashboard' },
    { id: 'workflows',    icon: '⇄', label: 'Workflows' },
    { id: 'builder',      icon: '✦', label: 'Builder' },
    { id: 'runs',         icon: '▷', label: 'Run Logs' },
    { id: 'integrations', icon: '⟐', label: 'Integrations' },
  ];
  const bottomItems = [{ id: 'settings', icon: '◌', label: 'Settings' }];

  const Item = ({ item }) => {
    const isActive = active === item.id;
    return (
      <div
        onClick={() => onNav(item.id)}
        className={`
          flex items-center gap-2.5 rounded-xl cursor-pointer transition-all duration-150 mb-0.5
          ${collapsed ? 'justify-center px-0 py-2.5' : 'px-3.5 py-2.5'}
          ${isActive
            ? 'bg-ink-100 dark:bg-ink-700 border-l-2 border-gold-500 text-ink-900 dark:text-ink-50'
            : 'border-l-2 border-transparent text-ink-400 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700 hover:text-ink-700 dark:hover:text-ink-200'}
        `}
      >
        <span className={`text-base leading-none shrink-0 ${isActive ? 'text-gold-500' : 'text-ink-300 dark:text-ink-500'}`}>
          {item.icon}
        </span>
        {!collapsed && (
          <span className="text-sm font-medium font-body">{item.label}</span>
        )}
      </div>
    );
  };

  return (
    <div className={`
      flex flex-col shrink-0 bg-white dark:bg-ink-800
      border-r border-ink-200 dark:border-ink-700
      transition-all duration-200
      ${collapsed ? 'w-14 px-2' : 'w-56 px-2'}
    `}>
      {/* Logo */}
      <div className={`flex items-center gap-2.5 border-b border-ink-100 dark:border-ink-700 py-4 ${collapsed ? 'justify-center px-1' : 'px-2'}`}>
        <img src="../../assets/gp-logo.png" alt="GP" className="w-7 h-7 object-contain shrink-0" />
        {!collapsed && (
          <span className="font-display font-extrabold text-[15px] tracking-tight text-ink-900 dark:text-ink-50 leading-none">
            Golden Passport
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 pt-3">
        {navItems.map(item => <Item key={item.id} item={item} />)}
      </nav>

      {/* Bottom */}
      <div className="border-t border-ink-100 dark:border-ink-700 pt-3 pb-4">
        {bottomItems.map(item => <Item key={item.id} item={item} />)}
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 mt-1">
            <Avatar name="Alex Morgan" size={28} />
            <div>
              <div className="text-[13px] font-semibold font-body text-ink-900 dark:text-ink-50 leading-tight">Alex Morgan</div>
              <div className="text-[11px] text-ink-400 dark:text-ink-500 font-body">Admin</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar });
