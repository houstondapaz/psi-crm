"use client";

import { useState } from "react";
import {
  LABEL_COLORS,
  LABEL_COLOR_CLASSES,
  LABEL_COLOR_OPTION_STYLES,
  isLabelColor,
  type LabelColor,
} from "@/lib/label-colors";
import { getLabelColorLabel } from "@/lib/i18n";

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
    <select
      id={id}
      name={name}
      value={color}
      onChange={(event) => {
        const { value } = event.target;
        if (isLabelColor(value)) {
          setColor(value);
        }
      }}
      className={`mt-1 block w-full rounded-sm border border-gray-200 px-3 py-2 text-sm ${LABEL_COLOR_CLASSES[color]}`}
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
    </select>
  );
}
