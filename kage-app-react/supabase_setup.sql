-- Supabase Datenbank Setup für KaGe App (vereinfacht)
-- Führe dieses Script im Supabase SQL Editor aus

-- 1. Users Tabelle für Authentifizierung
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  vorname TEXT,
  nachname TEXT,
  role TEXT DEFAULT 'mitglied',
  privacy_consent JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. App Settings Tabelle für globale Einstellungen
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Default Session Setting
INSERT INTO app_settings (key, value) VALUES ('session', '"Session 2026/2027"')
ON CONFLICT (key) DO NOTHING;