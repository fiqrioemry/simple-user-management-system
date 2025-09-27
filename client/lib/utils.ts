//

import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const buildFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      if (value.length > 0 && value[0] instanceof File) {
        value.forEach((file) => {
          formData.append(key, file);
        });
      } else {
        value.forEach((item) => {
          formData.append(`${key}`, item);
        });
      }
    } else if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};

type DateFormat = "DD/MM/YY" | "MM/DD/YY" | "YYYY-MM-DD" | "LOCALE";

export const formatDateTime = (
  dateStr: string | Date,
  format: DateFormat = "LOCALE"
) => {
  const date = new Date(dateStr);

  switch (format) {
    case "DD/MM/YY":
      return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    case "MM/DD/YY":
      return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
        date.getDate()
      ).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    case "YYYY-MM-DD":
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")} ${String(
        date.getHours()
      ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

    default: // pakai format lokal (id-ID)
      return date.toLocaleString("id-ID", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
  }
};

export const formatDate = (dateStr: string, format: DateFormat = "LOCALE") => {
  const date = new Date(dateStr);

  switch (format) {
    case "DD/MM/YY":
      return `${String(date.getDate()).padStart(2, "0")}/${String(
        date.getMonth() + 1
      ).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

    case "MM/DD/YY":
      return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
        date.getDate()
      ).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

    case "YYYY-MM-DD":
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(date.getDate()).padStart(2, "0")}`;

    default:
      return date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
  }
};
