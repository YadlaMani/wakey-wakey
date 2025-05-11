import React from "react";
import { TooltipProps } from "recharts";

type Payload = {
  value: number;
  name: string;
  color: string;
};

type CustomTooltipProps = TooltipProps<number, string> & {
  active?: boolean;
  payload?: Payload[];
  label?: string;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-3 border rounded shadow">
        <p className="label">{`Time: ${label}`}</p>
        <p className="intro">{`Latency: ${payload[0].value} ms`}</p>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
