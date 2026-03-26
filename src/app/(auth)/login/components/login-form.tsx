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
import { loginSchema, type TLogin } from "../schema";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, isLoading, error: authError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TLogin>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = async (data: TLogin) => {
   
    await login({
      Email: data.email,
      Password: data.password,
    });
  };

  return (
    <div className="my-auto w-full max-w-[380px] mx-auto flex flex-col animate-in fade-in slide-in-from-left-4 duration-700">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Backoffice login</h1>
          <ShieldCheck className="w-5 h-5 text-[#0066FF] shrink-0" />
        </div>
        <p className="text-sm text-slate-500 font-medium font-sans">
          Internal system for HiTradies administrators
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-[13px] font-semibold text-slate-900">Email</Label>
          <Input 
            {...register("email")}
            id="email"
            type="email" 
            disabled={isLoading}
            placeholder="m@example.com" 
            className={cn(
              "h-10 border-slate-300 rounded-md shadow-sm focus-visible:ring-1 focus-visible:ring-slate-400",
              errors.email && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.email && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-[13px] font-semibold text-slate-900">Password</Label>
            <Link href="/auth/forgot-password" className="text-[13px] hover:underline cursor-pointer">
              Forgot your password?
            </Link>
          </div>
          <div className="relative group">
            <Input 
              {...register("password")}
              id="password"
              disabled={isLoading}
              type={showPassword ? "text" : "password"} 
              className={cn(
                "h-10 border-slate-300 rounded-md shadow-sm pr-11 focus-visible:ring-1 focus-visible:ring-slate-400",
                errors.password && "border-red-500 focus-visible:ring-red-500"
              )}
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.password.message}</p>}
        </div>

      
        <div className="flex items-center justify-between px-3 py-2 border border-slate-200 rounded-[4px] bg-[#fdfdfd] shadow-sm min-h-[65px]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#228b4e] rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <span className="text-[16px] font-normal text-[#313131]">Thành công!</span>
          </div>
          <div className="flex flex-col items-end pt-1">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/4/4b/Cloudflare_Logo.svg" 
              alt="Cloudflare" 
              className="h-[14px] mb-[1px]" 
              style={{ filter: 'invert(52%) sepia(91%) saturate(2855%) hue-rotate(360deg) brightness(101%) contrast(105%)' }}
            />
            <span className="text-[9px] font-black tracking-tight text-black leading-none uppercase">Cloudflare</span>
          </div>
        </div>

      
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-11 bg-[#00A3FF] hover:bg-[#0086d1] text-white font-semibold rounded-md shadow-sm transition-all cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading && <Loader2 className="animate-spin mr-2 w-4 h-4" />}
          {isLoading ? "Authenticating..." : "Login"}
        </Button>

      
        {authError && (
          <p className="text-sm text-red-500 text-center font-medium bg-red-50 p-2 rounded border border-red-100 animate-shake">
            {authError}
          </p>
        )}
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200"></span>
        </div>
        <div className="relative flex justify-center text-[13px]">
          <span className="bg-white px-3 text-slate-400 font-medium">Or continue with</span>
        </div>
      </div>

    
      <Button 
        variant="outline" 
        disabled={isLoading} 
        className="w-full h-11 border-slate-200 rounded-md font-medium text-slate-700 hover:bg-slate-50 relative cursor-pointer disabled:cursor-not-allowed"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" alt="Google" className="absolute left-4" />
        <span>Đăng nhập bằng Google</span>
      </Button>

      <div className="text-center mt-8 text-sm text-slate-600">
        Don't have an account?{" "}
        <Link href="/auth/sign-up" className="font-semibold text-slate-900 underline underline-offset-4 cursor-pointer">Sign up</Link>
      </div>
    </div>
  );
}