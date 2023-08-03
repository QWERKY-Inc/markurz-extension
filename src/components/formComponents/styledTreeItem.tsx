import { TreeItem, TreeItemProps } from "@mui/lab";
import { Box, SvgIconProps, Typography } from "@mui/material";

export function StyledTreeItem(
  props: TreeItemProps & {
    labelIcon: React.ElementType<SvgIconProps>;
    labelText: string;
  },
) {
  const { labelIcon, labelText, ...other } = props;

  return (
    <TreeItem
      label={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 0.5,
            pr: 0,
          }}
        >
          <Box component={labelIcon} color="inherit" sx={{ mr: 1 }} />
          <Typography
            variant="body2"
            sx={{ fontWeight: "inherit", flexGrow: 1 }}
          >
            {labelText}
          </Typography>
        </Box>
      }
      {...other}
    />
  );
}
