"use client";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/store/slices/authSlice"; // আপনার ফাইলের সঠিক পাথ দিন
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    // ১. Redux স্টোর থেকে ডাটা মুছে ফেলা
    dispatch(logout());

    // ২. ইউজারকে লগইন পেজে পাঠিয়ে দেওয়া
    router.push("/auth");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full text-sm font-bold transition"
    >
      LOGOUT
    </button>
  );
}
