import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-brand text-white',
        secondary: 'border-transparent bg-surface text-foreground',
        outline: 'border-border text-foreground',
        destructive: 'border-transparent bg-accent-light text-accent',
        success: 'border-transparent bg-emerald-50 text-emerald-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

type BadgeBaseProps = React.HTMLAttributes<HTMLElement> & VariantProps<typeof badgeVariants>

type BadgeProps = BadgeBaseProps & {
  as?: 'div' | 'span' | 'button'
}

function Badge({ as = 'div', className, variant, ...props }: BadgeProps) {
  const classes = cn(badgeVariants({ variant }), className)

  if (as === 'button') {
    return <button type="button" className={classes} {...props} />
  }

  if (as === 'span') {
    return <span className={classes} {...props} />
  }

  return <div className={classes} {...props} />
}

export { Badge, badgeVariants }
export type { BadgeProps }
