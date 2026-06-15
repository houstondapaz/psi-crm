import { requireAuth } from "@/lib/auth/session";
import { AgendaCalendar } from "@/components/agenda-calendar";
import { PageHeader } from "@/components/ui/page-header";
import {
  getAgendaRange,
  getAgendaTitle,
  listAgendaEvents,
  parseAgendaDate,
  parseAgendaView,
} from "@/services/agenda-service";

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; date?: string }>;
}) {
  const auth = await requireAuth();
  const params = await searchParams;
  const view = parseAgendaView(params.view);
  const anchorDate = parseAgendaDate(params.date);
  const { start, end } = getAgendaRange(view, anchorDate);
  const events = await listAgendaEvents(auth, start, end);

  return (
    <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
      <PageHeader
        title="Agenda"
        description="Sessões agendadas e lembretes do consultório"
      />
      <AgendaCalendar
        events={events}
        view={view}
        anchorDate={anchorDate.toISOString().slice(0, 10)}
        title={getAgendaTitle(view, anchorDate)}
      />
    </main>
  );
}
