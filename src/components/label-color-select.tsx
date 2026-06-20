"use client";

import { useState } from "react";
import { Select } from "@/components/ui/select";
import {
  LABEL_COLORS,
  LABEL_COLOR_CLASSES,
  LABEL_COLOR_OPTION_STYLES,
  isLabelColor,
  type LabelColor,
} from "@/lib/label-colors";
import { getLabelColorLabel } from "@/lib/i18n";
import { cn } from "@/lib/cn";

type LabelColorSelectProps = {
  id: string;
  name?: string;
  defaultValue: LabelColor;
};

export function LabelColorSelect({
  id,
  name = "color",
  defaultValue,
}: LabelColorSelectProps) {
  const [color, setColor] = useState(defaultValue);

  return (
    <Select
      id={id}
      name={name}
      value={color}
      onValueChange={(value) => {
        if (value && isLabelColor(value)) {
          setColor(value);
        }
      }}
      className={cn("mt-1", LABEL_COLOR_CLASSES[color])}
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
