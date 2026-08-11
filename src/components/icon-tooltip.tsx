import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ComponentProps, ReactNode } from "react";

type IconTooltipProps = ComponentProps<typeof Tooltip> & {
  children: ReactNode;
  content: ReactNode;
  tooltipContentProps?: ComponentProps<typeof TooltipContent>;
};

export default function IconTooltip({
  children,
  content,
  delayDuration = 200,
  tooltipContentProps,
  ...props
}: IconTooltipProps) {
  return (
    <Tooltip {...props} delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent {...tooltipContentProps}>{content}</TooltipContent>
    </Tooltip>
  );
}
