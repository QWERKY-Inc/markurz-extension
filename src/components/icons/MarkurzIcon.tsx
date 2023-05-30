import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

interface MarkurzIconProps extends SvgIconProps {}

const MarkurzIcon = (props: MarkurzIconProps) => {
  return (
    <SvgIcon {...props}>
      <path d="M 5.91465,0 11.9832,6.0084375 17.9916,4.23429e-5 24,6.0084375 23.983125,12.539775 17.9916,6.548235 12,12.539775 5.9485875,6.54828 1.327515e-5,12.539775 0,5.991675 Z" />
      <path d="M 5.91465,11.460375 11.9832,17.46885 17.9916,11.46045 24,17.46885 23.98313,24.00015 17.9916,18.008625 12,24.00015 5.9485875,18.0087 1.327515e-5,24.00015 0,17.45205 Z" />
    </SvgIcon>
  );
};

export default MarkurzIcon;
