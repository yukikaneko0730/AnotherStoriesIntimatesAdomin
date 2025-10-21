import Image from "next/image";
import { cn } from "@/lib/utils";

export function AccountCard({ account }: { account: any }) {
  return (
    <div
      className={cn(
        "p-4 rounded-2xl border shadow-sm bg-surface/60 hover:shadow-md transition backdrop-blur-sm",
        account.status === "Active" ? "border-accent3/40" : "border-accent2/20 opacity-70"
      )}
    >
      <div className="flex items-center gap-4">
        <Image
          src={account.image}
          alt={account.name}
          width={48}
          height={48}
          className="rounded-full border border-accent3/40"
        />
        <div className="flex-1">
          <h3 className="font-serif text-accent2 text-lg">{account.name}</h3>
          <p className="text-sm text-neutral/70">{account.role}</p>
        </div>
      </div>
      <div className="mt-3 text-sm text-accent2/70">
        <p>{account.email}</p>
      </div>
      <div
        className={cn(
          "mt-2 inline-block px-3 py-1 text-xs rounded-full",
          account.status === "Active"
            ? "bg-success/40 text-success/80"
            : "bg-accent2/20 text-accent2"
        )}
      >
        {account.status}
      </div>
    </div>
  );
}
