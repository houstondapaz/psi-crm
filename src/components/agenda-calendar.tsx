"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { AgendaEvent, AgendaView } from "@/lib/agenda-utils";
import {
  buildMonthGrid,
  buildWeekDays,
  eventsForDay,
  formatAgendaDateParam,
  isSameDay,
} from "@/lib/agenda-utils";
import { formatLocalTime } from "@/lib/datetime";
import { formatWeekdayShort, getWeekdayLabels, t } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AgendaCalendarProps = {
  events: AgendaEvent[];
  view: AgendaView;
  anchorDate: string;
  title: string;
};

const weekdayLabels = getWeekdayLabels();

function EventTime({ startsAt }: { startsAt: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatLocalTime(startsAt));
  }, [startsAt]);

  if (!time) {
    return null;
  }

  return <>{time} </>;
}

function eventStyles(type: AgendaEvent["type"]) {
  return type === "session"
    ? "bg-gray-900 text-white hover:bg-gray-700"
    : "bg-amber-100 text-amber-900 hover:bg-amber-200";
}

function navigateDate(anchor: string, view: AgendaView, delta: number) {
  const date = new Date(`${anchor}T12:00:00`);
  if (view === "month") {
    date.setMonth(date.getMonth() + delta);
  } else if (view === "week") {
    date.setDate(date.getDate() + delta * 7);
  } else {
    date.setDate(date.getDate() + delta);
  }
  return formatAgendaDateParam(date);
}

function AgendaEventLink({ event }: { event: AgendaEvent }) {
  const showTime = event.type === "session";

  return (
    <Link
      href={event.href}
      className={`block truncate rounded px-1.5 py-0.5 text-xs font-medium transition ${eventStyles(event.type)}`}
      title={`${event.title} · ${event.patientName}`}
    >
      {showTime ? <EventTime startsAt={event.startsAt} /> : ""}
      {event.patientName}
    </Link>
  );
}

function ViewToggle({
  view,
  anchorDate,
}: {
  view: AgendaView;
  anchorDate: string;
}) {
  const options: { id: AgendaView; label: string }[] = [
    { id: "month", label: t("agenda.viewMonth") },
    { id: "week", label: t("agenda.viewWeek") },
    { id: "day", label: t("agenda.viewDay") },
  ];

  return (
    <div className="inline-flex rounded-sm border border-gray-200 bg-white p-1">
      {options.map((option) => (
        <Link
          key={option.id}
          href={`/dashboard?view=${option.id}&date=${anchorDate}`}
          className={`rounded-sm px-3 py-1.5 text-sm font-medium transition ${
            view === option.id
              ? "bg-gray-900 text-white"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          {option.label}
        </Link>
      ))}
    </div>
  );
}

function MonthView({
  events,
  anchorDate,
}: {
  events: AgendaEvent[];
  anchorDate: string;
}) {
  const anchor = new Date(`${anchorDate}T12:00:00`);
  const today = new Date();
  const days = buildMonthGrid(anchor);

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {weekdayLabels.map((label) => (
          <div
            key={label}
            className="px-2 py-2 text-center text-xs font-medium uppercase text-gray-500"
          >
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const inMonth = day.getMonth() === anchor.getMonth();
          const dayEvents = eventsForDay(events, day);
          const isToday = isSameDay(day, today);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-28 border-b border-r border-gray-200 p-2 ${
                inMonth ? "bg-white" : "bg-gray-50"
              }`}
            >
              <div
                className={`mb-1 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                  isToday
                    ? "bg-gray-900 font-medium text-white"
                    : inMonth
                      ? "text-gray-900"
                      : "text-gray-400"
                }`}
              >
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <AgendaEventLink key={`${event.type}-${event.id}`} event={event} />
                ))}
                {dayEvents.length > 3 && (
                  <p className="text-xs text-gray-500">
                    {t("agenda.moreEvents", { count: dayEvents.length - 3 })}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function WeekView({
  events,
  anchorDate,
}: {
  events: AgendaEvent[];
  anchorDate: string;
}) {
  const anchor = new Date(`${anchorDate}T12:00:00`);
  const days = buildWeekDays(anchor);
  const today = new Date();

  return (
    <div className="grid gap-4 md:grid-cols-7">
      {days.map((day) => {
        const dayEvents = eventsForDay(events, day);
        const isToday = isSameDay(day, today);

        return (
          <Card key={day.toISOString()} className="space-y-3">
            <div>
              <p className="text-xs uppercase text-gray-500">
                {formatWeekdayShort(day)}
              </p>
              <p
                className={`text-lg font-semibold ${
                  isToday ? "text-gray-900" : "text-gray-700"
                }`}
              >
                {day.getDate()}
              </p>
            </div>
            <div className="space-y-2">
              {dayEvents.length === 0 && (
                <p className="text-xs text-gray-500">{t("agenda.noEvents")}</p>
              )}
              {dayEvents.map((event) => (
                <Link
                  key={`${event.type}-${event.id}`}
                  href={event.href}
                  className={`block rounded-lg px-2 py-2 text-sm transition ${eventStyles(event.type)}`}
                >
                  <p className="font-medium">{event.title}</p>
                  <p className="text-xs opacity-90">
                    {event.type === "session" ? (
                      <>
                        <EventTime startsAt={event.startsAt} />
                        {" · "}
                      </>
                    ) : (
                      ""
                    )}
                    {event.patientName}
                  </p>
                </Link>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function DayView({
  events,
  anchorDate,
}: {
  events: AgendaEvent[];
  anchorDate: string;
}) {
  const day = new Date(`${anchorDate}T12:00:00`);
  const dayEvents = eventsForDay(events, day);

  return (
    <Card className="space-y-3">
      {dayEvents.length === 0 && (
        <p className="text-sm text-gray-600">{t("agenda.noEventsDay")}</p>
      )}
      {dayEvents.map((event) => (
        <Link
          key={`${event.type}-${event.id}`}
          href={event.href}
          className={`block rounded-lg px-4 py-3 transition ${eventStyles(event.type)}`}
        >
          <p className="font-medium">{event.title}</p>
          <p className="text-sm opacity-90">
            {event.type === "session" ? (
              <>
                <EventTime startsAt={event.startsAt} />
                {" · "}
              </>
            ) : (
              ""
            )}
            {event.patientName}
          </p>
        </Link>
      ))}
    </Card>
  );
}

export function AgendaCalendar({
  events,
  view,
  anchorDate,
  title,
}: AgendaCalendarProps) {
  const router = useRouter();

  function goTo(date: string) {
    router.push(`/dashboard?view=${view}&date=${date}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={() => goTo(navigateDate(anchorDate, view, -1))}
          >
            ←
          </Button>
          <h2 className="min-w-48 text-center text-lg font-semibold capitalize text-gray-900">
            {title}
          </h2>
          <Button
            variant="secondary"
            type="button"
            onClick={() => goTo(navigateDate(anchorDate, view, 1))}
          >
            →
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="ghost"
            type="button"
            onClick={() => goTo(formatAgendaDateParam(new Date()))}
          >
            {t("agenda.today")}
          </Button>
          <ViewToggle view={view} anchorDate={anchorDate} />
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-gray-900" />
          {t("agenda.legendSession")}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded bg-amber-200" />
          {t("agenda.legendReminder")}
        </span>
      </div>

      {view === "month" && <MonthView events={events} anchorDate={anchorDate} />}
      {view === "week" && <WeekView events={events} anchorDate={anchorDate} />}
      {view === "day" && <DayView events={events} anchorDate={anchorDate} />}
    </div>
  );
}
