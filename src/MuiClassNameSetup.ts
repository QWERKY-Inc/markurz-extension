import { unstable_ClassNameGenerator as ClassNameGenerator } from "@mui/material/className";

// WARNING this breaks many styles as it is experimental
ClassNameGenerator.configure((componentName) => `${componentName}`);
