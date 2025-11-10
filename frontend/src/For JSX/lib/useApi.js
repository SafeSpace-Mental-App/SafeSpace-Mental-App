import { useEffect, useRef, useState, useCallback } from 'react';
import { api } from './api';

export function useApi(path, { params, enabled = true } = {}) {
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(!!enabled);
  const [error,setError] = useState(null);
  const keyRef = useRef(JSON.stringify({ path, params }));

  const load = useCallback(async () => {
    if (!enabled) return;
    setLoading(true); setError(null);
    try {
      const d = await api.request(path, { query: params });
      setData(d);
    } catch (e) { setError(e); }
    finally { setLoading(false); }
  }, [path, enabled, JSON.stringify(params)]);

  useEffect(()=>{ load(); }, [load]);

  const mutate = useCallback((next) => {
    setData(typeof next === 'function' ? next(data) : next);
  }, [data]);

  return { data, loading, error, reload: load, mutate };
}
