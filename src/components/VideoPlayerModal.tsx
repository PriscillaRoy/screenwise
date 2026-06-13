"use client";

import { useEffect, useRef } from "react";

interface Props {
  title: string;
  archiveId: string;   // Internet Archive identifier e.g. "popeye_blow_me_down"
  onClose: () => void;
}

export default function VideoPlayerModal({ title, archiveId, onClose }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on backdrop click
  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  const embedUrl = `https://archive.org/embed/${archiveId}?autoplay=1`;

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-4xl mx-4">

        {/* Header */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-white font-semibold text-lg truncate pr-4">{title}</h2>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
            aria-label="Close player"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Player — 16:9 aspect ratio */}
        <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ paddingTop: "56.25%" }}>
          <iframe
            src={embedUrl}
            className="absolute inset-0 w-full h-full"
            allowFullScreen
            allow="autoplay; fullscreen"
            frameBorder="0"
            title={title}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 px-1">
          <p className="text-xs text-gray-500">
            Public domain content via{" "}
            <a
              href={`https://archive.org/details/${archiveId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Internet Archive
            </a>
          </p>
          <a
            href={`https://archive.org/details/${archiveId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
          >
            Open original
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>

      </div>
    </div>
  );
}