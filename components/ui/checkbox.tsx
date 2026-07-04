import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center justify-center w-4 h-4", className)}>
        <input
          type="checkbox"
          className="peer absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0 p-0"
          ref={ref}
          onChange={(e) => {
            if (onCheckedChange) {
              onCheckedChange(e.target.checked)
            }
            if (props.onChange) {
              props.onChange(e)
            }
          }}
          {...props}
        />
        <div className="w-4 h-4 border border-primary rounded-sm bg-transparent peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 pointer-events-none flex items-center justify-center transition-colors">
          <Check className="h-3 w-3 opacity-0 peer-checked:opacity-100 transition-opacity" />
        </div>
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
