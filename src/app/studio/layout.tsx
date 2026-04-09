export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          body > a[href="#main-content"] { display: none !important; }
          header, nav, footer { display: none !important; }
          main { padding: 0 !important; }
          #main-content {
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            z-index: 9999;
          }
        `,
      }} />
      {children}
    </>
  )
}
