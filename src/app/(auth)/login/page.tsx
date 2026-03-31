import { LoginForm } from "@/components/auth/login-form";
import { AuthBackground } from "@/components/auth/auth-background";

export default function LoginPage() {
  return (
    <main className="min-h-screen w-full font-sans overflow-hidden">
      <AuthBackground>
        <LoginForm />
      </AuthBackground>
    </main>
  );
}