import { defineConfig } from "@sugarcube-sh/cli";

export default defineConfig({
  utilities: {
    // Text colors
    color: {
      source: "color.*",
      prefix: "text"
    },
    // Background colors
    "background-color": {
      source: "color.*",
      prefix: "bg"
    },
    // Border colors
    "border-color": {
      source: "color.*",
      prefix: "border"
    }
  }
});