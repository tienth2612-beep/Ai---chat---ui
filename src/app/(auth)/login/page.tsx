import { LoginForm } from "@/app/(auth)/login/components/login-form";
import { AuthBackground } from "@/app/(auth)/login/components/auth-background";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full font-sans overflow-hidden">
      <AuthBackground>
        <LoginForm />
      </AuthBackground>
    </main>
  );
}