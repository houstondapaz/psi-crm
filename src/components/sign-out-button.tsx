import { signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";

function PowerIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9"
      />
    </svg>
  );
}

type SignOutButtonProps = {
  className?: string;
};

export function SignOutButton({ className = "" }: SignOutButtonProps) {
  return (
    <form
      action={async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
      }}
    >
      <Button
        variant="secondary"
        type="submit"
        className={`px-2.5 py-2.5 ${className}`.trim()}
        aria-label={t("app.signOut")}
      >
        <PowerIcon />
      </Button>
    </form>
  );
}
