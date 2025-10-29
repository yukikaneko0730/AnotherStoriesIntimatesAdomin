//components/HQBlogEditor.tsx
"use client";

import { useState } from "react";

interface HQBlogEditorProps {
  onSubmit: (data: any) => void;
  initialData?: any;       
  isEditing?: boolean;     
}

export default function HQBlogEditor({
  onSubmit,
  initialData = {},        
  isEditing = false,       
}: HQBlogEditorProps) {
  const categories = [
    "Design",
    "Community",
    "Sustainability",
    "Fashion",
    "Mindfulness",
    "Leadership",
    "Technology",
  ];

  const [title, setTitle] = useState(initialData.title || "");
  const [author, setAuthor] = useState(initialData.author || "");
  const [category, setCategory] = useState(initialData.category || categories[0]);
  const [coverImage, setCoverImage] = useState(initialData.coverImage || "");
  const [imageAlt, setImageAlt] = useState(initialData.imageAlt || "");
  const [metaDesc, setMetaDesc] = useState(initialData.metaDesc || "");
  const [content, setContent] = useState(initialData.content || "");
  const [writtenDate, setWrittenDate] = useState(initialData.writtenDate || "");
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = () => {
    if (!title || !content || !writtenDate) {
      alert("Please fill in title, content, and date.");
      return;
    }
    onSubmit({
      title,
      author: author || "HQ Admin",
      category,
      coverImage,
      imageAlt,
      metaDesc,
      content,
      writtenDate,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-8 bg-white/60 rounded-2xl shadow-sm">
      {/* Left: Editor */}
      <div className="flex-1">
        <h2 className="text-2xl font-poetic text-accent1 mb-4">
          {isEditing ? "✏️ Edit Post" : "🖋 Write a New Post"}
        </h2>

        <textarea
          placeholder="Begin writing here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={20}
          className="w-full border border-accent3/40 rounded-lg p-4 text-neutral/80 leading-relaxed"
        />

        <button
          onClick={handleSubmit}
          className="bg-accent1 text-white px-6 py-3 rounded-lg mt-4 hover:bg-accent1/80 transition"
        >
          {isEditing ? "💾 Update Post" : "🚀 Publish"}
        </button>
      </div>

      {/* Right: Meta Info */}
      <div className="w-full md:w-80 flex flex-col gap-6">
        {/* URL & Author */}
        <div className="border border-accent3/40 rounded-xl p-4 bg-white/40">
          <h3 className="text-sm font-semibold text-neutral/70 mb-2">
            URL & Author
          </h3>
          <input
            type="text"
            placeholder="URL Friendly Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-lg w-full px-3 py-2 mb-2"
          />
          <input
            type="text"
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="border rounded-lg w-full px-3 py-2"
          />
        </div>

        {/* Cover Image */}
        <div className="border border-accent3/40 rounded-xl p-4 bg-white/40">
          <h3 className="text-sm font-semibold text-neutral/70 mb-2">
            Cover Image
          </h3>
          {coverImage && (
            <img
              src={coverImage}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg mb-2"
            />
          )}
          <input
            type="text"
            placeholder="Cover Image URL"
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            className="border rounded-lg w-full px-3 py-2 mb-2"
          />
          <input
            type="text"
            placeholder="Image Alt Text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            className="border rounded-lg w-full px-3 py-2 mb-2"
          />
          <textarea
            placeholder="Enter meta description (max 200 chars)"
            maxLength={200}
            value={metaDesc}
            onChange={(e) => setMetaDesc(e.target.value)}
            className="border rounded-lg w-full px-3 py-2"
          />
        </div>

        {/* Category & Date */}
        <div className="border border-accent3/40 rounded-xl p-4 bg-white/40">
          <h3 className="text-sm font-semibold text-neutral/70 mb-2">
            Category & Date
          </h3>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded-lg w-full px-3 py-2 mb-2"
          >
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <input
            type="date"
            value={writtenDate}
            onChange={(e) => setWrittenDate(e.target.value)}
            className="border rounded-lg w-full px-3 py-2"
          />
        </div>
      </div>
    </div>
  );
}
