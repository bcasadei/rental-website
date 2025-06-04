import { supabase } from './supabaseClient';

export async function getRentals() {
  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .order('id', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getFeaturedRentals() {
  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .order('id', { ascending: true })
    .limit(3);
  if (error) throw error;
  return data;
}

export async function getRentalById(id: number) {
  const { data, error } = await supabase
    .from('rentals')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}
