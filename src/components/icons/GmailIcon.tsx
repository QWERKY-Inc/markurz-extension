import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

interface GmailIconProps extends SvgIconProps {}

const GmailIcon = (props: GmailIconProps) => {
  return (
    <SvgIcon {...props}>
      <path
        d="M2.50047 20.2544H5.99855V11.7602L1 8.00781V18.7543C1 19.586 1.67332 20.2544 2.50047 20.2544Z"
        fill="#4285F4"
      />
      <path
        d="M18.0015 20.2544H21.4995C22.3267 20.2544 23 19.5813 23 18.7543V8.00781L18.0015 11.7555V20.2544Z"
        fill="#34A853"
      />
      <path
        d="M18.0015 5.25534V11.7524L23 8.00469V6.00325C23 4.15131 20.8838 3.09109 19.401 4.20415L18.0015 5.25534Z"
        fill="#FBBC04"
      />
      <path
        d="M5.99854 11.7596V5.25781L12 9.75815L18.0014 5.25781V11.7596L12 16.2552L5.99854 11.7596Z"
        fill="#EA4335"
      />
      <path
        d="M1 6.01106V8.0125L5.99855 11.7602V5.25886L4.59906 4.21196C3.11621 3.09891 1 4.15912 1 6.01106Z"
        fill="#C5221F"
      />
    </SvgIcon>
  );
};

export default GmailIcon;
