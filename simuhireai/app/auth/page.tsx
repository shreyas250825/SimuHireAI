"use client"; // add this at the very top if your component uses client hooks

import { useRouter } from "next/navigation";

import { loginWithGoogle } from "@/lib/auth";
import { getUserRole } from "@/lib/getUserRole";

const LoginPage = () => {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      const role = await getUserRole(user.uid);

      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/setup"); // where they add LinkedIn, domain, etc.
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <button
        onClick={handleLogin}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Login with Google
      </button>
    </div>
  );
};

export default LoginPage;
