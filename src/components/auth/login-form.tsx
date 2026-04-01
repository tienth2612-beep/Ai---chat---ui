"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { useAuth } from "@/hooks/use-auth";
import { loginSchema, type TLogin } from "@/app/(auth)/login/schema";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error: authError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: TLogin) => {
    await login({
      email: data.email,
      password: data.password,
    });
  };

  // Helper variables for auth errors
  const isEmailError = authError?.toLowerCase().includes("email");
  const isPasswordError = authError?.toLowerCase().includes("password");

  return (
    /* 
       THAY ĐỔI TẠI ĐÂY: 
       - Xóa max-h-[calc(100dvh-24px)] 
       - Xóa overflow-y-auto
       - Thêm h-fit để hộp tự co giãn theo nội dung
    */
    <div className="w-full bg-white rounded-[32px] px-8 py-8 h-fit shadow-2xl shadow-blue-900/20 animate-in fade-in zoom-in-95 duration-700">
      
      {/* Header Section */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-5">
          <img
            src="/logo-hitradies-standard-04.png"
            alt="HiTradies Logo"
            className="h-[72px] w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Backoffice login
          </h1>
          <ShieldCheck className="w-5 h-5 text-[#0066FF] shrink-0" />
        </div>
        <p className="text-[13.5px] text-slate-500 font-medium font-sans">
          Internal system for HiTradies administrators
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        
        {/* Email Field */}
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[13px] font-semibold text-slate-900 ml-1">
            Email Address
          </Label>
          <Input
            id="email"
            {...register("email")}
            type="email"
            placeholder="name@hitradies.com"
            disabled={isLoading}
            className={cn(
              "h-11 border-slate-200 rounded-xl px-4 focus-visible:ring-1 focus-visible:ring-slate-400 transition-all shadow-sm",
              (errors.email || isEmailError) && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {(errors.email || isEmailError) && (
            <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium animate-in fade-in slide-in-from-top-1">
              {errors.email?.message || authError}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between ml-1">
            <Label htmlFor="password" className="text-[13px] font-semibold text-slate-900">
              Password
            </Label>
            <Link
              href="/forgot-password"
              title="Forgot your password?"
              className="text-[12px] text-slate-500 hover:text-slate-900 hover:underline cursor-pointer transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative group">
            <Input
              id="password"
              {...register("password")}
              type={showPassword ? "text" : "password"}
              disabled={isLoading}
              className={cn(
                "h-11 border-slate-200 rounded-xl px-4 pr-11 focus-visible:ring-1 focus-visible:ring-slate-400 transition-all shadow-sm",
                (errors.password || isPasswordError) && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          {(errors.password || isPasswordError) && (
            <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium animate-in fade-in slide-in-from-top-1">
              {errors.password?.message || authError}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-11 bg-[#00A3FF] hover:bg-[#0086d1] text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all mt-2 cursor-pointer active:scale-[0.98] disabled:opacity-70"
        >
          {isLoading && <Loader2 className="animate-spin mr-2 w-5 h-5" />}
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        {/* Generic Auth Error */}
        {authError && !isEmailError && !isPasswordError && (
          <p className="text-[12.5px] text-red-500 text-center font-bold mt-2 animate-in fade-in">
            {authError}
          </p>
        )}
      </form>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-100"></span>
        </div>
        <div className="relative flex justify-center text-[10px] uppercase tracking-[0.15em] text-slate-400 font-bold">
          <span className="bg-white px-4">Or continue with</span>
        </div>
      </div>

      {/* Google Login */}
      <Button
        type="button"
        variant="outline"
        disabled={isLoading}
        className="w-full h-11 border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 relative shadow-sm cursor-pointer transition-all active:scale-[0.98] disabled:opacity-70"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          width="18"
          height="18"
          alt="Google Logo"
          className="absolute left-7"
        />
        <span className="text-[13px]">Sign in with Google</span>
      </Button>

      {/* Sign Up Link */}
      <div className="text-center mt-6 text-[13.5px] text-slate-500">
        Don't have an account?{" "}
        <Link
          href="/register"
          title="Create a new account"
          className="font-bold text-slate-900 underline underline-offset-4 cursor-pointer hover:text-[#00A3FF] transition-colors"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}