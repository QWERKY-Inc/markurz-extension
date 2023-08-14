import { SvgIcon, SvgIconProps } from "@mui/material";
import React from "react";

interface SlackIconProps extends SvgIconProps {}

const SlackIcon = (props: SlackIconProps) => {
  return (
    <SvgIcon {...props}>
      <path
        d="M5.62163 14.902C5.62163 16.1744 4.58395 17.2136 3.31142 17.2136C2.03906 17.2136 1 16.1744 1 14.902C1 13.6297 2.03924 12.5904 3.3116 12.5904H5.6218L5.62163 14.902ZM6.78619 14.902C6.78619 13.6297 7.82543 12.5904 9.09779 12.5904C10.3701 12.5904 11.4094 13.6295 11.4094 14.902V20.6884C11.4094 21.9608 10.3703 23 9.09779 23C7.82543 23 6.78619 21.9608 6.78619 20.6884V14.902Z"
        fill="#DE1C59"
      />
      <path
        d="M9.09779 5.62163C7.82543 5.62163 6.78619 4.58395 6.78619 3.31142C6.78619 2.03906 7.82543 1 9.09779 1C10.3701 1 11.4094 2.03924 11.4094 3.3116V5.6218L9.09779 5.62163ZM9.09779 6.78619C10.3701 6.78619 11.4094 7.82543 11.4094 9.09779C11.4094 10.3701 10.3703 11.4094 9.09779 11.4094H3.31142C2.03906 11.4094 1 10.3703 1 9.09779C1 7.82543 2.03924 6.78619 3.3116 6.78619H9.09779Z"
        fill="#35C5F0"
      />
      <path
        d="M18.3782 9.09779C18.3782 7.82543 19.4159 6.78619 20.6884 6.78619C21.9608 6.78619 23 7.82543 23 9.09779C23 10.3701 21.9608 11.4094 20.6884 11.4094H18.3782V9.09779ZM17.2136 9.09779C17.2136 10.3701 16.1744 11.4094 14.902 11.4094C13.6297 11.4094 12.5904 10.3703 12.5904 9.09779V3.31142C12.5904 2.03906 13.6295 1 14.902 1C16.1744 1 17.2136 2.03924 17.2136 3.3116V9.09779Z"
        fill="#2EB57D"
      />
      <path
        d="M14.902 18.3782C16.1744 18.3782 17.2136 19.4159 17.2136 20.6884C17.2136 21.9608 16.1744 23 14.902 23C13.6297 23 12.5904 21.9608 12.5904 20.6884V18.3782H14.902ZM14.902 17.2136C13.6297 17.2136 12.5904 16.1744 12.5904 14.902C12.5904 13.6297 13.6295 12.5904 14.902 12.5904H20.6884C21.9608 12.5904 23 13.6295 23 14.902C23 16.1744 21.9608 17.2136 20.6884 17.2136H14.902Z"
        fill="#EBB02E"
      />
    </SvgIcon>
  );
};

export default SlackIcon;
