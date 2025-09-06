"use client";

import { useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  showCloseButton?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
  children?: React.ReactNode;
  className?: string; // new optional prop to control width
}

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  showCloseButton = true,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  children,
  className = "max-w-2xl", // default width
}: ModalProps) {
  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "error":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      default:
        return <Info className="w-6 h-6 text-white" />;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      default:
        return "border-orange-200 bg-gradient-to-r from-orange-500 to-orange-600 text-white";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal */}
      <div
        className={`relative bg-white rounded-lg shadow-xl ${className} w-full mx-4 max-h-[90vh] overflow-y-auto`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b ${getTypeStyles()}`}
        >
          <div className="flex items-center space-x-3">
            {getIcon()}
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
            </div>
          </div>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {children ? (
            children
          ) : (
            <p className="text-gray-700 leading-relaxed">{message}</p>
          )}
        </div>

        {/* Footer */}
        {(onConfirm || !showCloseButton) && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
            {onConfirm && (
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm || onClose}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : type === "error"
                    ? "bg-red-600 hover:bg-red-700"
                    : type === "warning"
                      ? "bg-yellow-600 hover:bg-yellow-700"
                      : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Convenience components for common use cases
export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText,
}: Omit<ModalProps, "type">) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || "Success!"}
      message={message}
      type="success"
      onConfirm={onConfirm}
      confirmText={confirmText}
    />
  );
}

export function ErrorModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText,
}: Omit<ModalProps, "type">) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || "Error"}
      message={message}
      type="error"
      onConfirm={onConfirm}
      confirmText={confirmText}
    />
  );
}

export function InfoModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText,
}: Omit<ModalProps, "type">) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || "Information"}
      message={message}
      type="info"
      onConfirm={onConfirm}
      confirmText={confirmText}
    />
  );
}

export function WarningModal({
  isOpen,
  onClose,
  title,
  message,
  onConfirm,
  confirmText,
}: Omit<ModalProps, "type">) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title || "Warning"}
      message={message}
      type="warning"
      onConfirm={onConfirm}
      confirmText={confirmText}
    />
  );
}
