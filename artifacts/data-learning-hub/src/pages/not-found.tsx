import { Link } from "wouter";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4" data-testid="page-not-found">
      <div className="text-8xl font-black text-muted/50 mb-4">404</div>
      <h1 className="text-2xl font-bold mb-2">Page not found</h1>
      <p className="text-muted-foreground mb-6">The page you are looking for does not exist.</p>
      <Link href="/">
        <div className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity cursor-pointer" data-testid="button-go-home">
          <Home className="w-4 h-4" />
          Go to Home
        </div>
      </Link>
    </div>
  );
}
