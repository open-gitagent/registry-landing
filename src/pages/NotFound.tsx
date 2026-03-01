import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <section className="pt-24 pb-20 px-6">
      <div className="mx-auto max-w-6xl text-center py-20">
        <h1 className="text-4xl font-heading font-bold text-muted-foreground/30">404</h1>
        <p className="text-sm text-muted-foreground mt-4 font-body">Page not found</p>
        <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-primary mt-4 font-body hover:underline">
          <ArrowLeft className="w-3 h-3" /> Back to home
        </Link>
      </div>
    </section>
  );
}
