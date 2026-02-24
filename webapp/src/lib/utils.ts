import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "pp_";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDuration(seconds: number | null): string {
  if (seconds === null) return "—";
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return `${mins}m ${secs}s`;
  const hrs = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hrs}h ${remainMins}m`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "healthy":
    case "success":
      return "text-green-600 bg-green-50 border-green-200";
    case "failed":
    case "failure":
      return "text-red-600 bg-red-50 border-red-200";
    case "delayed":
    case "staleness":
      return "text-yellow-600 bg-yellow-50 border-yellow-200";
    case "sla_breach":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "running":
      return "text-blue-600 bg-blue-50 border-blue-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

export function getStatusDot(status: string): string {
  switch (status) {
    case "healthy":
    case "success":
      return "bg-green-500";
    case "failed":
    case "failure":
      return "bg-red-500";
    case "delayed":
    case "staleness":
      return "bg-yellow-500";
    case "sla_breach":
      return "bg-orange-500";
    case "running":
      return "bg-blue-500";
    default:
      return "bg-gray-400";
  }
}

export function timeSince(dateStr: string): string {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(dateStr).getTime()) / 1000
  );
  if (seconds < 60) return "just now";
  const mins = Math.floor(seconds / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
