"use client";

import { useEffect, useState } from "react";
import { Material } from '../types/material';
import { apiFetch } from "../lib/api";

export function useMaterials() {
  const [data, setData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<Material[]>("/materials")
      .then(data => {
        if (data) {
          setData(data);
        }
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
