import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          {
            'default': "bg-purple-600 text-white hover:bg-purple-700 active:bg-purple-800 shadow-md",
            'outline': "border-2 border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-900",
            'ghost': "hover:bg-gray-100 active:bg-gray-200 text-gray-700",
            'link': "text-purple-600 underline-offset-4 hover:underline",
          }[variant],
          {
            'default': "h-10 px-4 py-2",
            'sm': "h-9 px-3",
            'lg': "h-11 px-8",
            'icon': "h-10 w-10",
          }[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }

