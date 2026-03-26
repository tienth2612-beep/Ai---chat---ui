import { LoginForm } from "./components/login-form";
import { BrandingSection } from "./components/branding-section";

export default function LoginPage() {
  return (
    <main className="flex flex-col lg:flex-row min-h-screen w-full font-sans bg-white">
      <section className="w-full lg:w-1/2 border-r border-slate-100 min-h-screen flex flex-col p-6 py-12">
        <LoginForm />
      </section>

    
      <BrandingSection />
    </main>
  );
}