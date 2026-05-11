import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://zbdaoewookiyzojoostw.supabase.co";
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpiZGFvZXdvb2tpeXpvam9vc3R3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwNjQwNjMsImV4cCI6MjA5MTY0MDA2M30.LO_LrM9otkpJzCGx51bnZXbtv-uhMXq7rVqXTp50Srk";

const DEV_PROXY_PREFIX = "/supabase";

function buildRequestUrl(url) {
	if (!import.meta.env.DEV) return url;
	if (!url.startsWith(SUPABASE_URL)) return url;
	return url.replace(SUPABASE_URL, DEV_PROXY_PREFIX);
}

const proxiedFetch = (input, init) => {
	const rawUrl = typeof input === "string"
		? input
		: input instanceof URL
			? input.toString()
			: input.url;

	const rewrittenUrl = buildRequestUrl(rawUrl);

	if (rewrittenUrl === rawUrl) {
		return fetch(input, init);
	}

	if (typeof input === "string" || input instanceof URL) {
		return fetch(rewrittenUrl, init);
	}

	return fetch(new Request(rewrittenUrl, input), init);
};

// In einigen Browsern/Extensions (z. B. mit SES/Lockdown) kann der
// standardmaessige Auth-Lock haengen. Dieser Lock fuehrt den Callback direkt aus.
const noOpAuthLock = async (_name, _acquireTimeout, fn) => fn();

export function getSupabaseAuthBaseUrl() {
	return import.meta.env.DEV ? `${DEV_PROXY_PREFIX}/auth/v1` : `${SUPABASE_URL}/auth/v1`;
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
	global: {
		fetch: proxiedFetch,
	},
	auth: {
		lock: noOpAuthLock,
	},
});
