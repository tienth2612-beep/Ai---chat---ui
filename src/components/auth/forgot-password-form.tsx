"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, KeyRound, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; 
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { setCookie } from "@/lib/cookies"; 

// Schema validation
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type TForgotPassword = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TForgotPassword>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: TForgotPassword) => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Giả lập gọi API (1.5 giây)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // 2. LƯU EMAIL VÀO COOKIE ĐỂ TRANG RESET PASSWORD ĐỌC ĐƯỢC
      setCookie("reset_email", data.email);

      // 3. ĐIỀU HƯỚNG SANG TRANG RESET
      router.push("/reset-password");
      
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* 
       ĐÃ THÊM LẠI: bg-white, rounded-[32px], px-8, py-10, shadow-2xl 
       Giống hệt cấu trúc RegisterForm ban đầu của bạn.
    */
    <div className="w-full bg-white rounded-[32px] px-8 py-10 shadow-2xl shadow-blue-900/20 animate-in fade-in zoom-in-95 duration-700">
      
      {/* Header Section */}
      <div className="text-center mb-8 w-full">
        <div className="flex justify-center mb-6">
          <img
            src="/logo-hitradies-standard-04.png"
            alt="HiTradies Logo"
            className="h-[72px] w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Forgot Password
          </h1>
          <KeyRound className="w-5 h-5 text-[#0066FF] shrink-0" />
        </div>
        <p className="text-[13.5px] text-slate-500 font-medium font-sans">
          Enter your email to receive a reset code
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
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
              "h-11 border-slate-200 rounded-xl px-4 focus-visible:ring-1 focus-visible:ring-slate-400 transition-all shadow-sm bg-white",
              (errors.email || error) && "border-red-500 focus-visible:ring-red-500"
            )}
          />
          {errors.email && (
            <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium animate-in fade-in slide-in-from-top-1">
              {errors.email?.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-[#00A3FF] hover:bg-[#0086d1] text-white font-bold rounded-xl shadow-lg shadow-blue-100 transition-all mt-2 cursor-pointer active:scale-[0.98] disabled:opacity-70"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Sending...</span>
            </div>
          ) : (
            "Send Reset Link"
          )}
        </Button>

        {error && (
          <p className="text-[12.5px] text-red-500 text-center font-bold mt-2 animate-in fade-in">
            {error}
          </p>
        )}
      </form>

      {/* Footer Link */}
      <div className="text-center mt-8">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 font-bold text-slate-900 underline underline-offset-4 cursor-pointer hover:text-[#00A3FF] transition-colors text-[13.5px]"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to login
        </Link>
      </div>
    </div>
  );
}