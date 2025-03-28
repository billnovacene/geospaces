
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
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger className="w-full">
        <div className="py-3 px-4 text-xs text-[#8E9196] uppercase tracking-wide flex items-center justify-between bg-white cursor-pointer">
          <span>{title}</span>
          <span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        {children}
      </CollapsibleContent>
      <Separator className="mx-0 w-full opacity-20" />
    </Collapsible>
  );
}
