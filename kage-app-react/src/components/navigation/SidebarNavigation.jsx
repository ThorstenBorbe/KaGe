import { theme } from "../../styles/theme";

const MENU_BUTTON_BASE_STYLE = {
  width: "100%",
  border: "none",
  textAlign: "left",
  cursor: "pointer",
  fontSize: "18px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const LEVEL_CONFIG = [
  {
    padding: "12px",
    marginBottom: "0px",
    borderRadius: "10px",
    activeBackground: theme.colors.white,
    inactiveBackground: "transparent",
    activeColor: "#111",
    inactiveColor: theme.colors.sidebarText,
    childrenWrapStyle: { marginTop: "6px", marginLeft: "14px" },
    nodeWrapStyle: { marginBottom: "8px" },
  },
  {
    padding: "10px",
    marginBottom: "6px",
    borderRadius: "8px",
    activeBackground: "#fca5a5",
    inactiveBackground: "rgba(255,255,255,0.08)",
    activeColor: theme.colors.sidebarText,
    inactiveColor: theme.colors.sidebarText,
    childrenWrapStyle: { marginLeft: "12px", marginBottom: "4px" },
    nodeWrapStyle: {},
  },
  {
    padding: "8px 10px",
    marginBottom: "4px",
    borderRadius: "6px",
    activeBackground: "#fca5a5",
    inactiveBackground: "rgba(255,255,255,0.05)",
    activeColor: theme.colors.sidebarText,
    inactiveColor: theme.colors.sidebarText,
    childrenWrapStyle: { marginLeft: "12px", marginBottom: "4px" },
    nodeWrapStyle: {},
  },
  {
    padding: "7px 10px",
    marginBottom: "3px",
    borderRadius: "5px",
    activeBackground: "#fca5a5",
    inactiveBackground: "rgba(255,255,255,0.04)",
    activeColor: theme.colors.sidebarText,
    inactiveColor: theme.colors.sidebarText,
    childrenWrapStyle: { marginLeft: "12px", marginBottom: "4px" },
    nodeWrapStyle: {},
  },
];

function getConfig(depth) {
  return LEVEL_CONFIG[Math.min(depth, LEVEL_CONFIG.length - 1)];
}

function getButtonStyle(depth, isActive) {
  const config = getConfig(depth);
  return {
    ...MENU_BUTTON_BASE_STYLE,
    padding: config.padding,
    marginBottom: config.marginBottom,
    borderRadius: config.borderRadius,
    background: isActive ? config.activeBackground : config.inactiveBackground,
    color: isActive ? config.activeColor : config.inactiveColor,
  };
}

function NavigationNode({ node, depth, activeKey, openMenus, onNavigate, onToggleMenu }) {
  const config = getConfig(depth);
  const isOpen = !!openMenus[node.key];

  return (
    <div style={config.nodeWrapStyle}>
      <button
        onClick={() => {
          if (node.children) onToggleMenu(node.key);
          else onNavigate(node.key);
        }}
        style={getButtonStyle(depth, activeKey === node.key)}
      >
        <span>{node.label}</span>
        {node.children && <span>{isOpen ? "▾" : "▸"}</span>}
      </button>

      {node.children && isOpen && (
        <div style={config.childrenWrapStyle}>
          {node.children.map((child) => (
            <NavigationNode
              key={child.key}
              node={child}
              depth={depth + 1}
              activeKey={activeKey}
              openMenus={openMenus}
              onNavigate={onNavigate}
              onToggleMenu={onToggleMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SidebarNavigation({
  items,
  activeKey,
  openMenus,
  onNavigate,
  onToggleMenu,
  hasRole,
  menuRoles,
}) {
  const visibleItems = items.filter((item) => {
    const required = menuRoles[item.key];
    return !required || hasRole(required);
  });

  return (
    <div style={{ marginTop: "20px" }}>
      {visibleItems.map((item) => (
        <NavigationNode
          key={item.key}
          node={item}
          depth={0}
          activeKey={activeKey}
          openMenus={openMenus}
          onNavigate={onNavigate}
          onToggleMenu={onToggleMenu}
        />
      ))}
    </div>
  );
}
