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
      .then((response) => {
        setData(Array.isArray(response) ? response : []);
      })
      .catch((e: Error) => {
        setError(e.message);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}