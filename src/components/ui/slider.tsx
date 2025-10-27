import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn("relative flex w-full touch-none select-none items-center", className)}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full glass">
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb 
      className="block h-4 w-8 rounded-full border-0 transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer" 
      style={{
        backgroundColor: 'hsl(142, 76%, 48%)',
        boxShadow: '0 0 20px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.5)',
      }}
      onMouseEnter={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.boxShadow = '0 0 30px rgba(16, 185, 129, 1), 0 0 60px rgba(16, 185, 129, 0.7)';
        }
      }}
      onMouseLeave={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.8), 0 0 40px rgba(16, 185, 129, 0.5)';
        }
      }}
    />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
