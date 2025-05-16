// lib/getUserRole.ts
import { supabase } from "./supabase";

export const getUserRole = async (uid: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", uid)
    .single();

  if (error) {
    console.error("Error fetching role:", error);
    return null;
  }

  return data.role;
};
