export function RollButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-md bg-gradient-to-r from-accent to-brass px-4 py-2 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-brass disabled:opacity-50"
    >
      Roll to Attack
    </button>
  );
}
