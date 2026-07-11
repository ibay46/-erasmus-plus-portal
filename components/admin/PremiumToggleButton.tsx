type Props = {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  isPremium: boolean;
};

export function PremiumToggleButton({ action, id, isPremium }: Props) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="cursor-pointer rounded-lg border border-border px-3 py-2 text-sm text-foreground transition-colors duration-200 hover:border-accent/50"
      >
        {isPremium ? "Ücretsiz Yap" : "Ücretli Yap"}
      </button>
    </form>
  );
}
