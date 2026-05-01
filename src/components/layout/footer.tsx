import { Icons } from "@/components/icons";
import { Twitter, Github, Linkedin } from "lucide-react";
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Icons.logo className="h-6 w-6 text-primary" />
          <p className="text-center text-sm leading-loose md:text-left">
            Built by your friends at Firebase.
          </p>
        </div>
        <div className="flex items-center gap-4">
            <Link href="#" target="_blank" rel="noreferrer" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="#" target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
            <Link href="#" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
            </Link>
        </div>
      </div>
    </footer>
  );
}
