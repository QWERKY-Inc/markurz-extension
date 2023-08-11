import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

interface AsanaIconProps extends SvgIconProps {}

const AsanaIcon = (props: AsanaIconProps) => {
  return (
    <SvgIcon {...props}>
      <path
        d="M18.2156 12.5881C15.5728 12.5881 13.4308 14.6949 13.4308 17.2937C13.4308 19.8928 15.5728 22 18.2156 22C20.858 22 23 19.8928 23 17.2937C23 14.6949 20.858 12.5881 18.2156 12.5881ZM5.78462 12.5883C3.14225 12.5886 1 14.6949 1 17.2939C1 19.8928 3.14225 21.9998 5.78462 21.9998C8.4272 21.9998 10.5695 19.8928 10.5695 17.2939C10.5695 14.6949 8.4272 12.5883 5.78439 12.5883H5.78462ZM16.7846 6.70583C16.7846 9.30468 14.6426 11.4121 12.0002 11.4121C9.35743 11.4121 7.21539 9.30468 7.21539 6.70583C7.21539 4.10697 9.35743 2 12.0002 2C14.6426 2 16.7844 4.10697 16.7844 6.70583H16.7846Z"
        fill="url(#paint0_radial_3510_387817)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_3510_387817"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(12.003 12.9429) scale(14.586 13.26)"
        >
          <stop stopColor="#FFB900" />
          <stop offset="0.6" stopColor="#F95D8F" />
          <stop offset="0.999" stopColor="#F95353" />
        </radialGradient>
      </defs>
    </SvgIcon>
  );
};

export default AsanaIcon;
