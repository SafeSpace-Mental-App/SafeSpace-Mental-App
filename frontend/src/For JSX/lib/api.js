// ✅ Direct base URL and prefix
const BASE_URL = "https://safe-place-sigma.vercel.app";
const API_PREFIX = "/api"; // your backend prefix

// ✅ Helper to join base, prefix, and path correctly
function buildUrl(path, query) {
  const base = BASE_URL.replace(/\/+$/, '');
  const prefix = API_PREFIX ? `/${API_PREFIX.replace(/^\/+|\/+$/g, '')}` : '';
  const route = `/${String(path || '').replace(/^\/+/, '')}`;
  const url = new URL(`${base}${prefix}${route}`);

  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v != null) url.searchParams.set(k, v);
    });
  }

  return url;
}

// ✅ Main API utility
export const api = {
  // Token helpers
  token() {
    return localStorage.getItem('auth_token');
  },

  setToken(token) {
    localStorage.setItem('auth_token', token);
  },

  clearToken() {
    localStorage.removeItem('auth_token');
  },

  // Generic API request handler
  async request(path, { method = 'GET', body, query } = {}) {
    const isAbsolute = /^https?:\/\//i.test(path);
    const url = isAbsolute ? new URL(path) : buildUrl(path, query);

    const res = await fetch(url.toString(), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token() ? { Authorization: `Bearer ${this.token()}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (!res.ok) {
      let errorMessage = '';
      try {
        const data = await res.json();
        errorMessage = data.message || JSON.stringify(data);
      } catch {
        try {
          errorMessage = await res.text();
        } catch {
          errorMessage = `${res.status} ${res.statusText}`;
        }
      }
      throw new Error(errorMessage);
    }

    // Return parsed JSON (unless no content)
    return res.status === 204 ? null : res.json();
  },
};
