export function findActiveLabel(items, activeKey) {
  for (const item of items) {
    if (item.key === activeKey) return item.label;
    if (item.children) {
      for (const child of item.children) {
        if (child.key === activeKey) return child.label;
        if (child.children) {
          for (const grand of child.children) {
            if (grand.key === activeKey) return grand.label;
            if (grand.children) {
              const gg = grand.children.find((g) => g.key === activeKey);
              if (gg) return gg.label;
            }
          }
        }
      }
    }
  }
  if (activeKey === "einstellungen") return "Persönliche Einstellungen";
  return activeKey;
}

export function findAncestorKeys(items, targetKey, path = []) {
  for (const item of items) {
    const nextPath = item.children ? [...path, item.key] : path;
    if (item.key === targetKey) {
      return path;
    }
    if (item.children) {
      const found = findAncestorKeys(item.children, targetKey, nextPath);
      if (found) return found;
    }
  }
  return null;
}

export function buildCollapsedMenuState(previousMenus, ancestors) {
  const next = {};
  Object.keys(previousMenus).forEach((menuKey) => {
    next[menuKey] = ancestors.includes(menuKey);
  });
  return next;
}

export function buildToggledMenuState(previousMenus, key, topLevel, subLevel, grandLevel) {
  const isOpen = previousMenus[key];
  const updated = { ...previousMenus };

  if (topLevel.includes(key)) {
    topLevel.forEach((k) => { updated[k] = false; });
    subLevel.forEach((k) => { updated[k] = false; });
    grandLevel.forEach((k) => { updated[k] = false; });
  } else if (subLevel.includes(key)) {
    subLevel.forEach((k) => { updated[k] = false; });
    grandLevel.forEach((k) => { updated[k] = false; });
  } else if (grandLevel.includes(key)) {
    grandLevel.forEach((k) => { updated[k] = false; });
  }

  updated[key] = !isOpen;
  return updated;
}
