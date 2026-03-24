import { defineConfig } from "unocss";
import {
  loadAndResolveTokens,
  loadInternalConfig,
  processAndConvertTokens,
} from "@sugarcube-sh/core";

// Editor-only UnoCSS config for the VS Code UnoCSS extension.
// Sugarcube still owns the actual runtime/build integration.
const { config } = await loadInternalConfig();

if (!config.resolver) {
  throw new Error(
    "Sugarcube resolver could not be determined. Set `resolver` in sugarcube.config.ts."
  );
}

const { trees, resolved } = await loadAndResolveTokens({
  type: "resolver",
  resolverPath: config.resolver,
  config,
});

const tokens = await processAndConvertTokens(trees, resolved, config);

function getEditorTokenContext(allTokens: Record<string, Record<string, unknown>>) {
  const preferredContext = config.output?.defaultContext;
  const candidateContexts = [
    preferredContext ? allTokens[preferredContext] : undefined,
    allTokens.default,
    ...Object.values(allTokens),
  ];

  return (
    candidateContexts.find((value) => value && typeof value === "object") as
      | Record<string, unknown>
      | undefined
  ) ?? {};
}

function isResolvedToken(value: unknown): value is {
  $path: string;
  $resolvedValue?: string | number;
  $value?: string | number;
} {
  return !!value && typeof value === "object" && "$path" in value;
}

function normalizeEditorCssValue(value: string | number) {
  if (typeof value !== "string") {
    return value;
  }

  const hex = value.trim();
  const shortHexMatch = hex.match(/^#([a-fA-F0-9]{3})$/);
  if (shortHexMatch) {
    const [r, g, b] = shortHexMatch[1].split("").map((part) => Number.parseInt(part + part, 16));
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }

  const fullHexMatch = hex.match(/^#([a-fA-F0-9]{6})$/);
  if (fullHexMatch) {
    const normalized = fullHexMatch[1];
    const r = Number.parseInt(normalized.slice(0, 2), 16);
    const g = Number.parseInt(normalized.slice(2, 4), 16);
    const b = Number.parseInt(normalized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }

  return value;
}

function getClassNamesForUtility({
  tokenPath,
  source,
  prefix,
  stripDuplicates,
}: {
  tokenPath: string;
  source: string;
  prefix?: string;
  stripDuplicates?: boolean;
}) {
  const sourceBase = source.endsWith(".*") ? source.slice(0, -2) : source;

  if (!tokenPath.startsWith(`${sourceBase}.`)) {
    return [];
  }

  const rawSuffix = tokenPath.slice(sourceBase.length + 1);
  const normalizedSuffix = rawSuffix.replace(/\./g, "-");

  if (prefix) {
    const classNames = [`${prefix}-${normalizedSuffix}`];

    if (stripDuplicates && rawSuffix.startsWith(`${prefix}.`)) {
      classNames.push(`${prefix}-${rawSuffix.slice(prefix.length + 1).replace(/\./g, "-")}`);
    }

    return [...new Set(classNames)];
  }

  const directPrefix = source.includes(".") ? source.slice(0, source.indexOf(".")) : source;
  return [`${directPrefix}-${normalizedSuffix}`];
}

function getTokenCssValue(token: {
  $resolvedValue?: string | number;
  $value?: string | number;
}) {
  const value = token.$resolvedValue ?? token.$value;
  return value === undefined ? undefined : normalizeEditorCssValue(value);
}

function buildStaticEditorRules() {
  const utilityConfig = config.utilities ?? {};
  const tokenContext = getEditorTokenContext(tokens as Record<string, Record<string, unknown>>);
  const resolvedTokens = Object.values(tokenContext)
    .filter(isResolvedToken)
    .sort((a, b) => a.$path.localeCompare(b.$path));
  const ruleMap = new Map<string, Record<string, string | number>>();

  for (const [property, utilityDefinition] of Object.entries(utilityConfig)) {
    const utilityEntries = Array.isArray(utilityDefinition) ? utilityDefinition : [utilityDefinition];

    for (const entry of utilityEntries) {
      if (!entry?.source || typeof entry.source !== "string") {
        continue;
      }

      for (const token of resolvedTokens) {
        const cssValue = getTokenCssValue(token);
        if (cssValue === undefined) {
          continue;
        }

        const classNames = getClassNamesForUtility({
          tokenPath: token.$path,
          source: entry.source,
          prefix: entry.prefix,
          stripDuplicates: entry.stripDuplicates,
        });

        for (const className of classNames) {
          const existingRule = ruleMap.get(className) ?? {};
          existingRule[property] = cssValue;
          ruleMap.set(className, existingRule);
        }
      }
    }
  }

  return [...ruleMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([className, body]) => [className, body] as const);
}

export default defineConfig({
  // The UnoCSS VS Code language server injects presetWind3() by default when
  // a config does not declare its own `presets` field. Explicitly setting an
  // empty array prevents built-in utilities like `bg-red-700` from appearing
  // as valid in the editor.
  presets: [],
  rules: buildStaticEditorRules(),
});
