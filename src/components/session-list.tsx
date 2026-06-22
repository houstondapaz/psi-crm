import Link from "next/link";
import { SessionActionsMenu } from "@/components/session-actions-menu";
import { LabelChip } from "@/components/label-chip";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatSessionDateTime, getSessionStatusLabel, t } from "@/lib/i18n";
import type { SessionListItem } from "@/services/session-service";

function formatSessionDate(date: Date | null) {
  if (!date) {
    return t("common.noDate");
  }
  return formatSessionDateTime(date);
}

type SessionListProps = {
  sessions: SessionListItem[];
  emptyMessage?: string;
};

export function SessionList({
  sessions,
  emptyMessage = t("sessions.empty"),
}: SessionListProps) {
  return (
    <div className="space-y-2">
      {sessions.length === 0 && <EmptyState message={emptyMessage} />}
      {sessions.map((session) => (
        <Card key={session.id} className="hover:border-gray-300">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/sessions/${session.id}`}
              className="min-w-0 flex-1 transition hover:opacity-90"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-medium text-gray-900">{session.patientName}</p>
                <Badge variant="default">{getSessionStatusLabel(session.status)}</Badge>
              </div>
              <p className="text-sm text-gray-600">
                {formatSessionDate(session.displayDate)}
              </p>
              {session.labels.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {session.labels.map((label) => (
                    <LabelChip
                      key={label.id}
                      name={label.name}
                      color={label.color}
                    />
                  ))}
                </div>
              )}
            </Link>
            <SessionActionsMenu
              sessionId={session.id}
              status={session.status}
              scheduledAt={session.scheduledAt?.toISOString() ?? null}
              occurredAt={session.occurredAt?.toISOString() ?? null}
            />
          </div>
        </Card>
      ))}
    </div>
  );
}
