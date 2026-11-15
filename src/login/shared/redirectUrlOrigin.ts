/**
 * This file has been claimed for ownership from @oussemasahbeni/keycloakify-login-shadcn version 250004.0.18.
 * To relinquish ownership and restore this file to its original content, run the following command:
 *
 * $ npx keycloakify own --path "login/shared/redirectUrlOrigin.ts" --revert
 */

const SESSION_STORAGE_KEY = "redirectUrlOrigin";

const FALLBACK = "/";

function httpOrigin(value: string): string | undefined {
    try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:" ? url.origin : undefined;
    } catch {
        return undefined;
    }
}

function readStored(): string | undefined {
    try {
        const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
        return stored === null ? undefined : httpOrigin(stored);
    } catch {
        return undefined;
    }
}

function store(origin: string): void {
    try {
        sessionStorage.setItem(SESSION_STORAGE_KEY, origin);
    } catch {
        return;
    }
}

export function getRedirectUrlOrigin(pageId: string): string {
    // Keycloak renders error.ftl for a redirect_uri it rejected, so only trust the parameter on other pages.
    const redirectUri = pageId === "error.ftl" ? null : new URL(window.location.href).searchParams.get("redirect_uri");
    const origin = redirectUri === null ? undefined : httpOrigin(redirectUri);

    if (origin !== undefined) {
        store(origin);
        return origin;
    }

    return readStored() ?? FALLBACK;
}
