"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import {
  LABEL_COLORS,
  LABEL_COLOR_OPTION_STYLES,
  isStoredLabelColor,
  resolveLabelColor,
  type LabelColor,
} from "@/lib/label-colors";
import { getLabelColorLabel } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type LabelColorSelectProps = {
  id: string;
  name?: string;
  defaultValue: LabelColor | string;
};

export function LabelColorSelect({
  id,
  name = "color",
  defaultValue,
}: LabelColorSelectProps) {
  const resolvedDefault = resolveLabelColor(defaultValue);
  const [color, setColor] = useState(resolvedDefault);

  return (
    <Select
      id={id}
      name={name}
      value={color}
      onValueChange={(value) => {
        if (value && isStoredLabelColor(value)) {
          setColor(resolveLabelColor(value));
        }
      }}
      className={cn("mt-1")}
      style={LABEL_COLOR_OPTION_STYLES[color]}
    >
      {LABEL_COLORS.map((optionColor) => (
        <option
          key={optionColor}
          value={optionColor}
          style={LABEL_COLOR_OPTION_STYLES[optionColor]}
        >
          {getLabelColorLabel(optionColor)}
        </option>
      ))}
    </Select>
  );
}
