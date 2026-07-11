import { Badge } from "@/components/ui/Badge";

export function PriceBadge({ isPremium }: { isPremium: boolean }) {
  return isPremium ? (
    <Badge variant="info">Ücretli</Badge>
  ) : (
    <Badge variant="default">Ücretsiz</Badge>
  );
}
