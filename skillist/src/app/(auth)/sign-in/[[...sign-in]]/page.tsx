import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Background glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-md p-4 flex justify-center">
        <SignIn 
          path="/sign-in"
          routing="path"
          appearance={{
            elements: {
              card: "bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl shadow-primary/5",
              headerTitle: "text-foreground font-bold",
              headerSubtitle: "text-muted-foreground",
              socialButtonsBlockButton: "border-border/50 hover:bg-accent/50 transition-colors",
              socialButtonsBlockButtonText: "text-foreground font-medium",
              dividerLine: "bg-border/50",
              dividerText: "text-muted-foreground",
              formFieldLabel: "text-muted-foreground",
              formFieldInput: "bg-background/50 border-border/50 focus:ring-primary/50 text-foreground",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all",
              footerActionText: "text-muted-foreground",
              footerActionLink: "text-primary hover:text-primary/80 font-medium"
            }
          }}
        />
      </div>
    </div>
  );
}
