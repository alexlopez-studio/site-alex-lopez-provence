import * as React from 'react'
import { cn } from '@/lib/utils'

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('inline-flex h-10 items-center justify-center rounded-md bg-surface p-1 text-muted', className)}
      {...props}
    />
  )
)
TabsList.displayName = 'TabsList'

type TabsTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, active = false, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      data-state={active ? 'active' : 'inactive'}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        className
      )}
      {...props}
    />
  )
)
TabsTrigger.displayName = 'TabsTrigger'

export { TabsList, TabsTrigger }
