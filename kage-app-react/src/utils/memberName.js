export function getMemberName(member, user) {
  if (member?.Vorname && member?.Nachname) {
    return `${member.Vorname} ${member.Nachname}`.trim();
  }
  if (user?.vorname && user?.nachname) {
    return `${user.vorname} ${user.nachname}`.trim();
  }

  const profileName = String(user?.name ?? "").trim();
  if (profileName) return profileName;
  return [member?.Vorname, member?.Nachname, user?.vorname, user?.nachname]
    .filter(Boolean)
    .join(" ")
    .trim();
}

export function normalizeMemberName(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .toLocaleLowerCase("de-DE");
}
