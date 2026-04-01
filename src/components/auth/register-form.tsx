"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, UserPlus, Check, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const registerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a symbol"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type TRegister = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter(); // Khởi tạo router
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // State thông báo thành công
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TRegister>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password", "");

  const validations = [
    { label: "At least 8 characters", test: passwordValue.length >= 8 },
    { label: "Contains an uppercase letter", test: /[A-Z]/.test(passwordValue) },
    { label: "Contains a number", test: /[0-9]/.test(passwordValue) },
    { label: "Contains a symbol !@#$%^&*()_+=-:;;,.?~", test: /[^A-Za-z0-9]/.test(passwordValue) },
  ];

  const onSubmit = async (data: TRegister) => {
    setIsLoading(true);
    setIsSuccess(false);

    try {
      // Giả lập gọi API đăng ký (2 giây)
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      console.log("Registered successfully:", data);
      
      // 1. Hiện thông báo thành công
      setIsSuccess(true);
      setIsLoading(false);

      // 2. Tự động đăng nhập: Chờ 2 giây để người dùng thấy thông báo rồi chuyển hướng
      setTimeout(() => {
        router.push("/dashboard"); // Chuyển hướng đến trang chủ hoặc dashboard
      }, 2000);

    } catch (error) {
      setIsLoading(false);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="w-full max-w-[480px] mx-auto bg-white rounded-[32px] px-8 py-10 shadow-2xl shadow-blue-900/20 animate-in fade-in zoom-in-95 duration-700">
      
      <div className="text-center mb-8">
        <div className="flex justify-center mb-6">
          <img src="/logo-hitradies-standard-04.png" alt="Logo" className="h-[80px] w-auto object-contain" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create account</h1>
          <UserPlus className="w-5 h-5 text-[#0066FF]" />
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div className="space-y-1.5">
          <Label className="text-[13px] font-semibold text-slate-900 ml-1">Full Name</Label>
          <Input {...register("name")} placeholder="John Doe" disabled={isLoading || isSuccess} className="h-11 rounded-xl" />
          {errors.name && <p className="text-[11px] text-red-500 ml-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <Label className="text-[13px] font-semibold text-slate-900 ml-1">Email Address</Label>
          <Input {...register("email")} type="email" placeholder="name@hitradies.com" disabled={isLoading || isSuccess} className="h-11 rounded-xl" />
          {errors.email && <p className="text-[11px] text-red-500 ml-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <Label className="text-[13px] font-semibold text-slate-900 ml-1">Password</Label>
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              disabled={isLoading || isSuccess}
              className={cn("h-11 rounded-xl pr-11", errors.password && "border-red-500")}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2.5 py-1 ml-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
          <p className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Security Requirements:</p>
          <ul className="space-y-2">
            {validations.map((v, i) => (
              <li key={i} className={cn("flex items-center gap-2 text-[12.5px] transition-all", v.test ? "text-green-600 font-medium" : "text-slate-400")}>
                {v.test ? <Check size={14} className="stroke-[3px]" /> : <X size={14} className="text-slate-300" />}
                {v.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <Label className="text-[13px] font-semibold text-slate-900 ml-1">Confirm Password*</Label>
          <div className="relative">
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              disabled={isLoading || isSuccess}
              className={cn("h-11 rounded-xl pr-11", errors.confirmPassword && "border-red-500")}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-[11px] text-red-500 mt-1 ml-1 font-medium">{errors.confirmPassword.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
            <Button
            type="submit"
            disabled={isLoading || isSuccess}
            className={cn(
                "w-full h-12 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.98]",
                isSuccess ? "bg-green-500 hover:bg-green-500" : "bg-[#00A3FF] hover:bg-[#0086d1]"
            )}
            >
            {isLoading ? (
                <div className="flex items-center gap-2">
                <Loader2 className="animate-spin w-5 h-5" />
                <span>Processing...</span>
                </div>
            ) : isSuccess ? (
                <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Success!</span>
                </div>
            ) : (
                "Sign up"
            )}
            </Button>

            {/* THÔNG BÁO THÀNH CÔNG DƯỚI NÚT */}
            {isSuccess && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-2 text-green-700 justify-center">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-semibold">Account created! Redirecting to login...</span>
                    </div>
                </div>
            )}
        </div>
      </form>

      <div className="text-center mt-8 text-[14px] text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-[#00A3FF] hover:underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );
}