"use client";

import { useEffect, useState } from "react";
import { Alert } from "@/types";
import { timeSince } from "@/lib/utils";
import { AlertTriangle, XCircle, Clock } from "lucide-react";

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch("/api/alerts");
        if (res.ok) {
          setAlerts(await res.json());
        }
      } catch (err) {
        console.error("Failed to fetch alerts:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "failure":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "sla_breach":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case "staleness":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case "failure":
        return "bg-red-50 border-red-100";
      case "sla_breach":
        return "bg-orange-50 border-orange-100";
      case "staleness":
        return "bg-yellow-50 border-yellow-100";
      default:
        return "bg-gray-50 border-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Alerts</h1>
        <p className="mt-1 text-sm text-gray-500">
          Recent notifications about pipeline failures, SLA breaches, and staleness.
        </p>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="card py-12 text-center">
            <AlertTriangle className="mx-auto mb-3 h-8 w-8 text-gray-400" />
            <p className="text-gray-500">No alerts found. All pipelines are running smoothly!</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-4 rounded-xl border p-4 ${getAlertStyle(
                alert.type
              )}`}
            >
              <div className="shrink-0 pt-0.5">{getAlertIcon(alert.type)}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {alert.pipeline?.name || "Pipeline"}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {timeSince(alert.created_at)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-700">{alert.message}</p>
                <div className="mt-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                  {alert.type.replace("_", " ")}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
