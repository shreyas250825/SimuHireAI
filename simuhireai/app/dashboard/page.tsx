"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/auth");
      } else {
        const { data, error } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.uid)
          .single();

        if (data) setRole(data.role);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard ({role})</h1>

      {role === "candidate" && <p>🎯 Prepare for your mock interview</p>}
      {role === "interviewer" && <p>📝 View candidate responses</p>}
      {role === "admin" && <p>🛠 Manage platform data</p>}
    </div>
  );
}
