import React, { useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { Send, Image as ImageIcon, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput: React.FC = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { selectedUser, sendMessage } = useChatStore();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast.error("Image size should be less than 4MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage(
        selectedUser._id,
        text.trim(),
        imagePreview || undefined
      );
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 bg-sidebar-bg border-t border-white/10">
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-32 rounded-lg"
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageChange}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-white"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <div className="flex-1 bg-white/10 rounded-lg">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type a message..."
            className="w-full bg-transparent text-white placeholder-white/50 px-4 py-3 focus:outline-none resize-none"
            rows={1}
            style={{
              maxHeight: "120px",
              minHeight: "48px",
            }}
          />
        </div>

        <button
          type="submit"
          disabled={!text.trim() && !imagePreview}
          className="p-3 bg-message-sent hover:bg-message-sent/80 rounded-lg transition-colors text-dark-bg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
