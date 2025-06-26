import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

// Generic hook for Supabase queries
export function useSupabaseQuery<T>(
  table: string,
  query?: string,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        let supabaseQuery = supabase.from(table).select(query || '*');
        
        const { data, error } = await supabaseQuery;
        
        if (error) {
          setError(error);
        } else {
          setData(data as T[]);
        }
      } catch (err) {
        setError(err as PostgrestError);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, dependencies);

  return { data, loading, error };
}

// Hook for real-time subscriptions
export function useSupabaseSubscription<T>(
  table: string,
  filter?: string,
  callback?: (payload: any) => void
) {
  const [data, setData] = useState<T[] | null>(null);

  useEffect(() => {
    // Initial fetch
    supabase
      .from(table)
      .select('*')
      .then(({ data, error }) => {
        if (!error) {
          setData(data);
        }
      });

    // Set up real-time subscription
    const subscription = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter,
        },
        (payload) => {
          if (callback) {
            callback(payload);
          }
          
          // Update local state based on the change
          setData((currentData) => {
            if (!currentData) return currentData;
            
            switch (payload.eventType) {
              case 'INSERT':
                return [...currentData, payload.new as T];
              case 'UPDATE':
                return currentData.map((item: any) =>
                  item.id === payload.new.id ? payload.new : item
                );
              case 'DELETE':
                return currentData.filter((item: any) => item.id !== payload.old.id);
              default:
                return currentData;
            }
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [table, filter]);

  return data;
}

// Hook for mutations (insert, update, delete)
export function useSupabaseMutation() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);

  const insert = async (table: string, data: any) => {
    setLoading(true);
    setError(null);
    
    const { data: result, error } = await supabase
      .from(table)
      .insert(data)
      .select();
    
    setLoading(false);
    if (error) setError(error);
    
    return { data: result, error };
  };

  const update = async (table: string, id: string, data: any) => {
    setLoading(true);
    setError(null);
    
    const { data: result, error } = await supabase
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    
    setLoading(false);
    if (error) setError(error);
    
    return { data: result, error };
  };

  const remove = async (table: string, id: string) => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id);
    
    setLoading(false);
    if (error) setError(error);
    
    return { error };
  };

  return {
    insert,
    update,
    remove,
    loading,
    error,
  };
}