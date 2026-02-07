import { Badge } from '@/components/ui/badge';

interface FreeTierInfoProps {
  service: string;
  limit: string;
  overage?: string;
}

export function FreeTierInfo({ service, limit, overage }: FreeTierInfoProps) {
  return (
    <div className="my-4 p-4 border rounded-lg bg-card">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="secondary">무료 한도</Badge>
        <span className="font-semibold">{service}</span>
      </div>
      <p className="text-sm">
        <strong>한도:</strong> {limit}
      </p>
      {overage && (
        <p className="text-sm text-muted-foreground">
          <strong>초과 시:</strong> {overage}
        </p>
      )}
    </div>
  );
}
