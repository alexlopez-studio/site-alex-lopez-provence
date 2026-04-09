interface Step { title: string; description: string }

export default function NumberedSteps({ steps }: { steps: Step[] }) {
  return (
    <div className="my-8 flex flex-col gap-6">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand">
            <span className="text-[15px] font-bold text-white">{i + 1}</span>
          </div>
          <div className="pt-1.5">
            <p className="text-[16px] font-bold leading-[1.4] text-foreground">{step.title}</p>
            <p className="mt-1.5 text-[15px] leading-[1.7] text-muted">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
