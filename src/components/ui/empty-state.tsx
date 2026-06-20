type EmptyStateProps = {
  message: string;
};

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-white p-8 text-center">
      <p className="text-sm text-gray-600">{message}</p>
    </div>
  );
}
