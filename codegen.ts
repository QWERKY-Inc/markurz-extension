import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: [
    {
      [`${process.env.REACT_APP_BACKEND_URL}/graphql`]: {
        headers: {
          Authorization: `Bearer ${process.env.GQL_SCHEMA_TOKEN}`,
        },
      },
    },
  ],
  documents: ["./src/**/*.tsx", "./src/**/*.ts"],
  ignoreNoDocuments: true,
  generates: {
    "./src/generated/": {
      overwrite: true,
      preset: "client",
      presetConfig: {
        fragmentMasking: {
          unmaskFunctionName: "getFragmentData",
        },
      },
      plugins: [],
    },
    "./src/generated/schema.graphql": {
      overwrite: true,
      plugins: ["schema-ast"],
    },
  },
};
export default config;
