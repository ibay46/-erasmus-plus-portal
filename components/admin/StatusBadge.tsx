import { Badge } from "@/components/ui/Badge";

export function StatusBadge({ published }: { published: boolean }) {
  return published ? (
    <Badge variant="success">Yayında</Badge>
  ) : (
    <Badge variant="warning">Taslak</Badge>
  );
}
