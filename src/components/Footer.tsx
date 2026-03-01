import { Twitter, Linkedin, Mail, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background px-6 py-12">
      <div className="mx-auto max-w-[var(--content-max-width)] w-full">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="https://x.com/JonasBoury"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 hover:bg-muted text-foreground transition-all duration-200 text-sm font-medium"
            >
              <Twitter className="h-4 w-4" />
              X
            </a>
            <a
              href="https://www.linkedin.com/in/jonasboury/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 hover:bg-muted text-foreground transition-all duration-200 text-sm font-medium"
            >
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
            <a
              href="https://farcaster.xyz/jonasboury"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/80 hover:bg-muted text-foreground transition-all duration-200 text-sm font-medium"
            >
              <MessageCircle className="h-4 w-4" />
              Farcaster
            </a>
            <a
              href="mailto:hello@jonasboury.com"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-all duration-200 text-sm font-medium shadow-md"
            >
              <Mail className="h-4 w-4" />
              Email
            </a>
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Jonas Boury. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
