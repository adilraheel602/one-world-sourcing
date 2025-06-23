"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";

interface LoadingLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function LoadingLink({ href, children }: LoadingLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    setLoading(true);
    startTransition(() => {
      router.push(href); // client-side navigation (no full reload)
    });
  };

  return (
    <>
      <a href={href} onClick={handleClick}>
        {children}
      </a>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mb-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            <span className="text-sm font-medium text-gray-700">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
}
