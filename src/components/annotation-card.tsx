"use client";

import { useState } from "react";
import {
  deleteAnnotationAction,
  updateAnnotationAction,
} from "@/app/actions/domain";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type AnnotationCardProps = {
  sessionId: string;
  annotationId: string;
  content: string;
  recordedAtLabel: string;
  recordedAtValue: string;
};

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="m2.695 14.762-1.262 3.154a.5.5 0 0 0 .65.65l3.155-1.262a4 4 0 0 0 1.343-.885L17.5 5.501a2.121 2.121 0 0 0-3-3L3.58 13.42a4 4 0 0 0-.885 1.343Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 11.142A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-11.142.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const actionButtonClass =
  "inline-flex items-center gap-1.5 rounded-sm border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2";

export function AnnotationCard({
  sessionId,
  annotationId,
  content,
  recordedAtLabel,
  recordedAtValue,
}: AnnotationCardProps) {
  const [editing, setEditing] = useState(false);
  const [editingTime, setEditingTime] = useState(false);
  const formId = `annotation-form-${annotationId}`;

  function closeEditMode() {
    setEditing(false);
    setEditingTime(false);
  }

  if (!editing) {
    return (
      <Card
        role="button"
        tabIndex={0}
        onClick={() => setEditing(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setEditing(true);
          }
        }}
        className="cursor-pointer space-y-2 transition hover:border-gray-300"
      >
        <p className="text-sm text-gray-600">{recordedAtLabel}</p>
        <p className="whitespace-pre-wrap text-sm text-gray-900">{content}</p>
      </Card>
    );
  }

  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2">
        {editingTime ? (
          <Input
            form={formId}
            name="recordedAt"
            type="datetime-local"
            defaultValue={recordedAtValue}
            required
            className="max-w-xs text-sm"
          />
        ) : (
          <>
            <input
              form={formId}
              type="hidden"
              name="recordedAt"
              value={recordedAtValue}
            />
            <p className="text-sm text-gray-600">{recordedAtLabel}</p>
          </>
        )}
        <button
          type="button"
          onClick={() => setEditingTime((value) => !value)}
          className="rounded-sm p-1 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
          aria-label={editingTime ? "Cancelar edição da data" : "Editar data"}
        >
          <PencilIcon />
        </button>
      </div>
      <form id={formId} action={updateAnnotationAction} className="space-y-3">
        <input type="hidden" name="sessionId" value={sessionId} />
        <input type="hidden" name="annotationId" value={annotationId} />
        <Textarea
          name="content"
          defaultValue={content}
          className="min-h-24"
          required
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={closeEditMode}
            className={`${actionButtonClass} border-gray-200 bg-white text-gray-700 hover:bg-gray-50`}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className={`${actionButtonClass} border-gray-200 bg-white text-gray-700 hover:bg-gray-50`}
          >
            Salvar
            <CheckIcon />
          </button>
          <button
            type="submit"
            formAction={deleteAnnotationAction}
            className={`${actionButtonClass} border-red-200 bg-white text-red-700 hover:bg-red-50`}
          >
            Excluir
            <TrashIcon />
          </button>
        </div>
      </form>
    </Card>
  );
}
