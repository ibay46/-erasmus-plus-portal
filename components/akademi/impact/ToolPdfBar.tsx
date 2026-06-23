"use client";

export function ToolPdfBar() {
  return (
    <div className="flex items-center justify-between mb-6 print:hidden">
      <p className="text-sm text-muted-foreground">Doldurduktan sonra PDF olarak kaydedebilirsiniz.</p>
      <button
        type="button"
        onClick={() => window.print()}
        className="cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors duration-200 hover:bg-accent/90"
      >
        PDF Olarak İndir
      </button>
    </div>
  );
}
