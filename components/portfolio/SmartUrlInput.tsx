"use client";

import { useEffect, useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
};

function normalizeUrl(url: string) {
  if (!url) return "";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "https://" + url;
  }
  return url;
}

function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function detectType(url: string) {
  if (url.includes("github.com")) return "github";
  return "live";
}

export default function SmartUrlInput({
  label,
  value,
  onChange,
  placeholder,
}: Props) {
  const [internal, setInternal] = useState(value);
  const [valid, setValid] = useState(true);
  const [type, setType] = useState<"github" | "live" | null>(null);

  useEffect(() => {
    if (!internal) {
      setValid(true);
      setType(null);
      return;
    }

    const normalized = normalizeUrl(internal);
    const isValid = isValidUrl(normalized);

    setValid(isValid);
    setType(isValid ? detectType(normalized) : null);

    onChange(normalized);
  }, [internal]);

  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      <div className="relative">
        <input
          value={internal}
          onChange={(e) => setInternal(e.target.value)}
          placeholder={placeholder}
          className={`w-full border p-2 pr-10 rounded-md text-sm ${
            valid ? "border-gray-300" : "border-red-500"
          }`}
        />

        {/* ICON */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
          {type === "github" && ""}
          {type === "live" && valid && ""}
          {!valid && "⚠️"}
        </div>
      </div>

      {!valid && (
        <p className="text-xs text-red-500">Invalid URL</p>
      )}
    </div>
  );
}