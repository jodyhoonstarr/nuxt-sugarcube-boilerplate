import { defineConfig } from "@sugarcube-sh/cli";

export default defineConfig({
  utilities: {
    "background-color": {
      source: "color.*",
      prefix: "bg"
    }
  }
});