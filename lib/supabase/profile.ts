import { createClient } from "@/lib/supabase/server";

export type Role = "admin" | "caja";

export type Profile = {
  id: string;
  nombre: string;
  role: Role;
};

export async function getProfile(): Promise<Profile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nombre, role")
    .eq("id", user.id)
    .single();

  return profile as Profile | null;
}
