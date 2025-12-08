import type { LucideProps } from "lucide-react";
import { WashingMachine } from "lucide-react";

export const Icons = {
  Logo: (props: LucideProps) => (
    <WashingMachine {...props} />
  ),
  Sparkles: (props: LucideProps) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2L14.5 7.5L20 10L14.5 12.5L12 18L9.5 12.5L4 10L9.5 7.5L12 2Z"/><path d="M4 10L2 11L4 12"/><path d="M20 10L22 11L20 12"/><path d="M10 4L11 2L12 4"/><path d="M10 20L11 22L12 20"/></svg>, // Using lucide-react's Sparkles in practice would be better
  Smudge: (props: LucideProps) => ( // Placeholder for a smudge/dirty icon
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M10.5 20.5C10.5 20.5 6 22 3.5 19C1 16 1.5 10 1.5 10C1.5 10 2.5 4 7.5 3C12.5 2 15.5 5 15.5 5" />
      <path d="M12.5 6C12.5 6 17 1.5 21 3.5C25 5.5 22.5 12 22.5 12C22.5 12 21.5 18 16.5 19C11.5 20 8.5 17 8.5 17" />
      <path d="M15.5 10.5C15.5 10.5 16.5 10.5 17.5 9.5C18.5 8.5 18.5 7.5 18.5 7.5" />
    </svg>
  ),
};
