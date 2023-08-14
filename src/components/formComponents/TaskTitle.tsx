import { InfoOutlined } from "@mui/icons-material";
import { Typography, TypographyProps } from "@mui/material";
import React from "react";

interface TaskTitleProps extends TypographyProps {
  content: string;
}

const TaskTitle = (props: TaskTitleProps) => {
  const { content, ...typegraphyProps } = props;

  return (
    <Typography
      display="flex"
      gap={1}
      alignItems="center"
      color="text.secondary"
      {...typegraphyProps}
    >
      <InfoOutlined fontSize="small" />
      {content}
    </Typography>
  );
};

export default TaskTitle;
