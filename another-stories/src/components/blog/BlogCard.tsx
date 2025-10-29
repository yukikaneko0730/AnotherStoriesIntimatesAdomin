//components/blog/BlogCard.tsx
import Image from "next/image"
import Link from "next/link"

export function BlogCard({ blog }: { blog: any }) {
  return (
    <Link
      href={`/hq/blog/${blog.id}`}
      className="block rounded-xl border border-accent3/30 bg-surface/40 hover:shadow-md transition"
    >
      {blog.coverImage && (
        <Image
          src={blog.coverImage}
          alt={blog.title}
          width={400}
          height={200}
          className="w-full h-40 object-cover rounded-t-xl"
        />
      )}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-accent2">{blog.title}</h3>
        <p className="text-sm text-neutral/70 line-clamp-2">{blog.content}</p>
        <p className="text-xs text-neutral/50">
          ✍️ {blog.authorName} ・ {new Date(blog.createdAt.seconds * 1000).toLocaleDateString()}
        </p>
      </div>
    </Link>
  )
}
