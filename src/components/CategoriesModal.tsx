import { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import categoriesData from "@/data/categories.json";

interface CategoryItem {
  name: string;
  count?: number;
}

interface CategoryGroup {
  title: string;
  items: CategoryItem[];
}

interface CategorySection {
  heading: string;
  groups: CategoryGroup[];
}

const allSections: CategorySection[] = categoriesData as CategorySection[];

// Extract the "Main" section tabs and the rest of the content sections
const mainSection = allSections.find((s) => s.heading === "Main");
const tabs = ["Main", ...(mainSection?.groups[0]?.items.map((i) => i.name) ?? [])];
const contentSections = allSections.filter((s) => s.heading !== "Main");

interface CategoriesModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CategoriesModal({ open, onClose }: CategoriesModalProps) {
  const [activeTab, setActiveTab] = useState("Main");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-[95vw] w-full h-[90vh] p-0 gap-0 sm:rounded-2xl overflow-hidden border-primary/20 [&>button:last-child]:hidden">
        <DialogTitle className="sr-only">Categories</DialogTitle>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-primary/10 bg-primary/5 sticky top-0 z-20">
          <h2 className="text-xl font-bold text-foreground">Categories</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-primary/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content with left tabs + right content */}
        <div className="flex flex-1 h-[calc(90vh-65px)] overflow-hidden">
          {/* Left-hand vertical tabs */}
          <div className="flex flex-col border-r border-primary/10 bg-primary/5 shrink-0 w-48">
            <ScrollArea className="flex-1">
              <nav className="flex flex-col py-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-left px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground/70 hover:bg-primary/10 hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </div>

          {/* Right content area */}
          <ScrollArea className="flex-1">
            <div className="px-6 py-6 space-y-10 bg-gradient-to-b from-primary/[0.03] to-background">
              {contentSections.map((section) => (
                <div key={section.heading}>
                  <h3 className="text-lg font-bold text-primary mb-4 border-b border-primary/15 pb-2">
                    {section.heading}
                  </h3>
                  <div className="space-y-6">
                    {section.groups.map((group, gi) => (
                      <div key={gi}>
                        {group.title && (
                          <h4 className="text-sm font-semibold text-primary/60 uppercase tracking-wider mb-2">
                            {group.title}
                          </h4>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {group.items.map((item) => (
                            <button
                              key={item.name}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-foreground border border-primary/15 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors"
                            >
                              {item.name}
                              {item.count !== undefined && (
                                <span className="text-xs opacity-60">{item.count.toLocaleString()}</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
