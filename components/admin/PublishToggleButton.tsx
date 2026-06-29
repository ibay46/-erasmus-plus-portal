type Props = {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  published: boolean;
  adminBase?: string;
};

export function PublishToggleButton({ action, id, published, adminBase }: Props) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {adminBase && <input type="hidden" name="adminBase" value={adminBase} />}
      <button
        type="submit"
        className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
      >
        {published ? "Taslağa Al" : "Yayınla"}
      </button>
    </form>
  );
}
