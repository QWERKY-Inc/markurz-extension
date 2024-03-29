import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

interface JiraIconProps extends SvgIconProps {}

const JiraIcon = (props: JiraIconProps) => {
  return (
    <SvgIcon {...props}>
      <g clipPath="url(#clip0_865_54368)">
        <path
          d="M23.3285 11.3289L11.9996 0L0.670633 11.3289C0.49303 11.5073 0.393311 11.7487 0.393311 12.0004C0.393311 12.2521 0.49303 12.4935 0.670633 12.6718L11.9996 24.0008L23.3285 12.6718C23.5061 12.4935 23.6058 12.2521 23.6058 12.0004C23.6058 11.7487 23.5061 11.5073 23.3285 11.3289ZM11.9996 15.5474L8.45137 11.9992L11.9996 8.45101L15.5478 11.9992L11.9996 15.5474Z"
          fill="#2684FF"
        />
        <path
          d="M11.9996 8.47464C10.8836 7.35879 10.2545 5.84666 10.2496 4.26851C10.2448 2.69036 10.8646 1.17442 11.9738 0.0517578L4.18604 7.79031L8.41153 12.0158L11.9996 8.47464Z"
          fill="url(#paint0_linear_865_54368)"
        />
        <path
          d="M15.5571 11.9902L11.9995 15.5478C12.5546 16.1026 12.995 16.7613 13.2955 17.4863C13.5959 18.2114 13.7506 18.9885 13.7506 19.7733C13.7506 20.5581 13.5959 21.3353 13.2955 22.0603C12.995 22.7853 12.5546 23.444 11.9995 23.9988L19.7802 16.2181L15.5571 11.9902Z"
          fill="url(#paint1_linear_865_54368)"
        />
      </g>
      <defs>
        <linearGradient
          id="paint0_linear_865_54368"
          x1="11.3668"
          y1="4.86316"
          x2="6.41245"
          y2="9.81752"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.18" stopColor="#0052CC" />
          <stop offset="1" stopColor="#2684FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_865_54368"
          x1="12.6768"
          y1="19.096"
          x2="17.6218"
          y2="14.151"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.18" stopColor="#0052CC" />
          <stop offset="1" stopColor="#2684FF" />
        </linearGradient>
        <clipPath id="clip0_865_54368">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </SvgIcon>
  );
};

export default JiraIcon;
