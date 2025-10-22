//hq/chats/page.tsx
"use client"

export default function HQChatsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-poetic text-accent1">Chats</h1>
      <p className="text-neutral/70">
        Communicate directly with branch managers 💬
      </p>

      <ul className="space-y-2">
        {["SOHO Store", "Berlin Mitte", "Harajuku"].map((branch) => (
          <li
            key={branch}
            className="p-4 rounded-xl border border-accent3/30 bg-surface/40 hover:bg-surface/60 transition cursor-pointer"
          >
            <p className="font-medium text-accent2">{branch}</p>
            <p className="text-sm text-neutral/70">Last message: "All set for this week!"</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
