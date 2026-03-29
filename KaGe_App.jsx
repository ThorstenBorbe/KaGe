import React, { useMemo, useState } from "react";
import { CalendarDays, Users, Newspaper, Shield, Settings, Home, ChevronRight, ChevronDown, PartyPopper, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const appTree = [
  { key: "dashboard", label: "Dashboard", icon: Home },
  { key: "kalender", label: "Kalender", icon: CalendarDays },
  {
    key: "interne-veranstaltungen",
    label: "Interne Veranstaltungen",
    icon: PartyPopper,
    children: [
      { key: "11-11", label: "11.11. Jetzt geht los" },
      { key: "1-prunksitzung", label: "1. Prunksitzung" },
      { key: "2-prunksitzung", label: "2. Prunksitzung" },
      { key: "bunter-nachmittag", label: "Bunter Nachmittag" },
      { key: "beatbox-party", label: "Beatbox Party" },
      { key: "kinderfasching", label: "Kinderfasching" },
      { key: "kehraus", label: "Kehraus" },
    ],
  },
  {
    key: "externe-veranstaltungen",
    label: "Externe Veranstaltungen",
    icon: Building2,
    children: [
      { key: "auswaertssitzung-x", label: "1. Auswärtssitzung (X)" },
      { key: "auswaertssitzung-y", label: "2. Auswärtssitzung (Y)" },
      { key: "auswaertssitzung-z", label: "3. Auswärtssitzung (Z)" },
      { key: "seniorenheim", label: "Seniorenheim" },
    ],
  },
  {
    key: "gruppen",
    label: "Gruppen",
    icon: Users,
    children: [
      { key: "rote-garde", label: "Rote Garde" },
      { key: "blaue-garde", label: "Blaue Garde" },
      { key: "gruene-garde", label: "Grüne Garde" },
      { key: "beat2boeck", label: "Beat2Böck" },
      { key: "maennerbalett", label: "Männerbalett" },
      { key: "buettenredner", label: "Büttenredner" },
      { key: "elfinnen", label: "Elfinnen" },
      { key: "elferraete", label: "Elferräte" },
    ],
  },
  { key: "mitglieder", label: "Mitglieder", icon: Users },
  { key: "news", label: "News", icon: Newspaper },
  { key: "vorstandschaft", label: "Vorstandschaft", icon: Shield },
  { key: "einstellungen", label: "Einstellungen (nur Vorstand)", icon: Settings },
];

const dashboardStats = [
  { title: "Interne Veranstaltungen", value: 7 },
  { title: "Externe Veranstaltungen", value: 4 },
  { title: "Gruppen", value: 8 },
  { title: "Mitglieder", value: 128 },
];

function SidebarItem({ item, activeKey, onSelect, openSections, toggleSection, level = 0 }) {
  const Icon = item.icon;
  const hasChildren = !!item.children?.length;
  const isOpen = openSections.includes(item.key);
  const isActive = activeKey === item.key;

  return (
    <div className="w-full">
      <button
        onClick={() => {
          if (hasChildren) toggleSection(item.key);
          onSelect(item.key);
        }}
        className={`w-full flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition shadow-sm mb-1 ${
          isActive ? "bg-white text-black" : "text-white/85 hover:bg-white/10"
        }`}
        style={{ paddingLeft: `${12 + level * 16}px` }}
      >
        {hasChildren ? (
          isOpen ? <ChevronDown className="h-4 w-4 shrink-0" /> : <ChevronRight className="h-4 w-4 shrink-0" />
        ) : (
          <span className="w-4" />
        )}
        {Icon ? <Icon className="h-4 w-4 shrink-0" /> : <span className="w-4" />}
        <span className="text-sm font-medium">{item.label}</span>
      </button>

      {hasChildren && isOpen && (
        <div className="mt-1">
          {item.children.map((child) => (
            <SidebarItem
              key={child.key}
              item={child}
              activeKey={activeKey}
              onSelect={onSelect}
              openSections={openSections}
              toggleSection={toggleSection}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function findItemByKey(items, key) {
  for (const item of items) {
    if (item.key === key) return item;
    if (item.children) {
      const found = findItemByKey(item.children, key);
      if (found) return found;
    }
  }
  return null;
}

function buildBreadcrumb(items, key, path = []) {
  for (const item of items) {
    const nextPath = [...path, item.label];
    if (item.key === key) return nextPath;
    if (item.children) {
      const found = buildBreadcrumb(item.children, key, nextPath);
      if (found) return found;
    }
  }
  return null;
}

export default function KarnevalsgesellschaftApp() {
  const [activeKey, setActiveKey] = useState("dashboard");
  const [openSections, setOpenSections] = useState([
    "interne-veranstaltungen",
    "externe-veranstaltungen",
    "gruppen",
  ]);

  const activeItem = useMemo(() => findItemByKey(appTree, activeKey), [activeKey]);
  const breadcrumb = useMemo(() => buildBreadcrumb(appTree, activeKey) || ["Dashboard"], [activeKey]);

  const toggleSection = (key) => {
    setOpenSections((prev) =>
      prev.includes(key) ? prev.filter((entry) => entry !== key) : [...prev, key]
    );
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900">
      <div className="grid min-h-screen lg:grid-cols-[320px_1fr]">
        <aside className="bg-red-700 p-4 text-white">
          <div className="mb-6 rounded-3xl bg-white/10 p-4 backdrop-blur text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-white/70">Vereinsportal</p>
            <h1 className="mt-2 text-2xl font-bold">Karnevalsgesellschaft</h1>
            <p className="mt-2 text-sm text-white/80">Organisation, Termine, Gruppen und Kommunikation an einem Ort.</p>
          </div>

          <ScrollArea className="h-[calc(100vh-180px)] pr-2">
            <nav className="space-y-1">
              {appTree.map((item) => (
                <SidebarItem
                  key={item.key}
                  item={item}
                  activeKey={activeKey}
                  onSelect={setActiveKey}
                  openSections={openSections}
                  toggleSection={toggleSection}
                />
              ))}
            </nav>
          </ScrollArea>
        </aside>

        <main className="p-4 md:p-8">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
                {breadcrumb.map((entry, index) => (
                  <React.Fragment key={entry + index}>
                    <span>{entry}</span>
                    {index < breadcrumb.length - 1 && <ChevronRight className="h-4 w-4" />}
                  </React.Fragment>
                ))}
              </div>
              <h2 className="mt-2 text-3xl font-bold">{activeItem?.label || "Dashboard"}</h2>
            </div>
            <div className="flex gap-2">
              <Button className="rounded-2xl">Neuer Termin</Button>
              <Button variant="outline" className="rounded-2xl">Mitglied hinzufügen</Button>
            </div>
          </div>

          {activeKey === "dashboard" ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {dashboardStats.map((stat) => (
                  <Card key={stat.title} className="rounded-3xl shadow-sm">
                    <CardContent className="p-6">
                      <p className="text-sm text-neutral-500">{stat.title}</p>
                      <p className="mt-3 text-3xl font-bold">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <Card className="rounded-3xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Nächste Highlights</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "11.11. Jetzt geht los",
                      "1. Prunksitzung",
                      "Kinderfasching",
                      "Seniorenheim",
                    ].map((item) => (
                      <div key={item} className="flex items-center justify-between rounded-2xl border p-4">
                        <div>
                          <p className="font-medium">{item}</p>
                          <p className="text-sm text-neutral-500">Veranstaltung</p>
                        </div>
                        <Badge variant="secondary" className="rounded-xl">geplant</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="rounded-3xl shadow-sm">
                  <CardHeader>
                    <CardTitle>Aktive Gruppen</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      "Rote Garde",
                      "Blaue Garde",
                      "Grüne Garde",
                      "Beat2Böck",
                      "Männerbalett",
                    ].map((group) => (
                      <div key={group} className="rounded-2xl border p-4">
                        <p className="font-medium">{group}</p>
                        <p className="text-sm text-neutral-500">Trainings, Ansprechpartner, Termine</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card className="rounded-3xl shadow-sm">
              <CardHeader>
                <CardTitle>{activeItem?.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">
                  Hier entsteht der Bereich <strong>{activeItem?.label}</strong>. In der nächsten Ausbaustufe können hier
                  Listen, Termine, Verantwortliche, Dokumente, Zusagen, Aufgaben und interne Informationen angezeigt werden.
                </p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
