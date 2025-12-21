"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from "react";
import { Material } from '../types/material';
import { apiFetch } from "../lib/api";

export function useMaterials() {
  const router = useRouter();
  const [data, setData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<{ [key: string]: boolean }>({});

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiFetch<Material[]>("/materials");
      setData(Array.isArray(response) ? response : []);
      setError(null);
    } catch (e: any) {
      setError(e.message || 'Failed to fetch materials');
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  const deleteMaterial = async (id: string | number) => {
    const idStr = String(id);
    if (processing[idStr]) return;
    
    if (!confirm('Are you sure you want to delete this material? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessing(prev => ({ ...prev, [idStr]: true }));
      await apiFetch(`/materials/${id}`, { method: 'DELETE' });
      setData(prev => prev.filter(m => String(m.id) !== idStr));
    } catch (e: any) {
      setError(e.message || 'Failed to delete material');
      throw e;
    } finally {
      setProcessing(prev => ({ ...prev, [idStr]: false }));
    }
  };

  const updateMaterial = async (id: string | number, updates: Partial<Material>) => {
    const idStr = String(id);
    if (processing[idStr]) return;

    try {
      setProcessing(prev => ({ ...prev, [idStr]: true }));
      const updated = await apiFetch<Material>(`/materials/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates)
      });
      
      setData(prev => 
        prev.map(m => String(m.id) === idStr ? { ...m, ...updated } : m)
      );
      return updated;
    } catch (e: any) {
      setError(e.message || 'Failed to update material');
      throw e;
    } finally {
      setProcessing(prev => ({ ...prev, [idStr]: false }));
    }
  };

  const refresh = () => fetchMaterials();

  return { 
    data, 
    loading, 
    error, 
    deleteMaterial, 
    updateMaterial, 
    refresh, 
    processing 
  };
}