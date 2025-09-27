"use client";

import { z } from "zod";
import Image from "next/image";
import { X, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controller, useFormContext } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import React, { useCallback } from "react";

interface FileUploadFieldProps {
  name: string;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function FileUploadField({
  name,
  label,
  className,
  disabled,
}: FileUploadFieldProps) {
  const maxSize = 0.3 * 1024 * 1024; // 0.3MB
  const { control, setValue, formState } = useFormContext();

  const handleDrop = useCallback(
    (accepted: File[]) => {
      if (!accepted.length) return;

      const file = accepted[0];

      if (file.size > maxSize) {
        toast.error(`File too large. Max . 300kb`);
        return;
      }

      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        toast.error("Only JPG, PNG, WEBP allowed");
        return;
      }

      const preview = URL.createObjectURL(file);
      setValue(
        name,
        { file, preview },
        { shouldDirty: true, shouldValidate: true }
      );
    },
    [setValue, name, maxSize]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const value = field.value as { file?: File; preview?: string } | null;

        const { getRootProps, getInputProps, isDragActive } = useDropzone({
          onDrop: handleDrop,
          accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
          multiple: false,
          disabled,
        });

        return (
          <div className={cn("space-y-3", className)}>
            {label && <label className="text-sm font-medium">{label}</label>}

            {value?.preview ? (
              <div className="relative w-32 h-32">
                <Image
                  src={value.preview}
                  alt="Avatar preview"
                  fill
                  className="rounded-full object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0"
                  onClick={() => setValue(name, null, { shouldDirty: true })}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
                  isDragActive
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/25 hover:bg-muted/50",
                  disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm">
                    {isDragActive ? "Drop here" : "Upload avatar"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WEBP • Max 300 Kb
                  </p>
                </div>
              </div>
            )}

            {formState.errors[name] && (
              <p className="text-xs text-destructive">
                {formState.errors[name]?.message as string}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}
