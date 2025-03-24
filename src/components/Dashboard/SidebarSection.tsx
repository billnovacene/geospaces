
import { ReactNode, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { ChevronUp, ChevronDown } from "lucide-react";

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function SidebarSection({
  title,
  children,
  defaultOpen = true
}: SidebarSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible 
      defaultOpen={defaultOpen} 
      className="w-full"
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <div className="py-3 px-4 text-xs text-[#8E9196] uppercase tracking-wide flex items-center justify-between bg-white border-b border-gray-100">
        <span>{title}</span>
        <CollapsibleTrigger className="focus:outline-none hover:text-foreground">
          <span className="inline-block">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        {children}
      </CollapsibleContent>
      <Separator className="mx-0 w-full opacity-30" />
    </Collapsible>
  );
}
