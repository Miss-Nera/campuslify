import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-all duration-200 ease-in-out disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90 shadow-md ",
        destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
        outline:
          "border border-input bg-white hover:bg-gray-100 text-gray-900 shadow-sm dark:bg-transparent dark:text-white dark:border-gray-600",
        secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 shadow-sm",
        ghost:
          "bg-transparent hover:bg-gray-100 text-gray-800 dark:hover:bg-gray-800 dark:text-gray-100",
        link: "text-primary hover:underline underline-offset-4",
        sidebar: `
          w-full justify-start px-4 py-2 text-sm font-medium 
          text-black bg-transparent hover:bg-primary/10
          transition-all duration-200 ease-in-out rounded-lg 
          hover:text-black
          focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary
`,
      },
      size: {
        default: "h-10 px-5 text-sm",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
