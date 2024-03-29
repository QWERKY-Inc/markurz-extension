import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

interface TrelloIconProps extends SvgIconProps {}

const TrelloIcon = (props: TrelloIconProps) => {
  return (
    <SvgIcon {...props}>
      <g clipPath="url(#clip0_1036_47517)">
        <path
          d="M21.6562 0H2.34375C1.04933 0 0 1.04933 0 2.34375V21.6562C0 22.9507 1.04933 24 2.34375 24H21.6562C22.9507 24 24 22.9507 24 21.6562V2.34375C24 1.04933 22.9507 0 21.6562 0Z"
          fill="url(#paint0_linear_1036_47517)"
        />
        <path
          d="M19.7551 3.11914H14.6851C14.0637 3.11914 13.5601 3.62282 13.5601 4.24414V12.4941C13.5601 13.1155 14.0637 13.6191 14.6851 13.6191H19.7551C20.3764 13.6191 20.8801 13.1155 20.8801 12.4941V4.24414C20.8801 3.62282 20.3764 3.11914 19.7551 3.11914Z"
          fill="white"
        />
        <path
          d="M9.31512 3.11914H4.24512C3.6238 3.11914 3.12012 3.62282 3.12012 4.24414V18.4941C3.12012 19.1155 3.6238 19.6191 4.24512 19.6191H9.31512C9.93644 19.6191 10.4401 19.1155 10.4401 18.4941V4.24414C10.4401 3.62282 9.93644 3.11914 9.31512 3.11914Z"
          fill="white"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_1036_47517"
          x1="1200"
          y1="0"
          x2="1200"
          y2="2400"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#0091E6" />
          <stop offset="1" stopColor="#0079BF" />
        </linearGradient>
        <clipPath id="clip0_1036_47517">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  );
};

export default TrelloIcon;
