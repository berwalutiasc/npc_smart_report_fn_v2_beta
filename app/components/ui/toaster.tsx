import { useToast } from "@/hooks/use-toast";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  // Accept undefined or null safely
  const getIcon = (variant?: string | null) => {
    switch (variant ?? "default") { // fallback to "default" if null/undefined
      case "success":
        return <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />;
      case "destructive":
        return <XCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />;
      case "warning":
        return <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />;
      default:
        return <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />;
    }
  };

  return (
    <ToastProvider duration={3000}>
      {toasts.map(({ id, title, description, action, variant, ...props }) => (
        <Toast key={id} variant={variant ?? "default"} {...props}>
          <div className="grid gap-0.5 sm:gap-1 flex-1 min-w-0">
            {title && (
              <ToastTitle className="flex items-center gap-1.5 sm:gap-2">
                {getIcon(variant)}
                <span className="truncate">{title}</span>
              </ToastTitle>
            )}
            {description && <ToastDescription className="line-clamp-2">{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
