import { dirname } from "path"
import { fileURLToPath } from "url"
import { createRequire } from "module"
import tseslint from "typescript-eslint"
import importPlugin from "eslint-plugin-import-x"

const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

// Next.js 16 exports a flat config array from eslint-config-next
const nextConfig = require("eslint-config-next")
const nextCoreWebVitals = require("eslint-config-next/core-web-vitals")

/** @type {import("eslint").Linter.Config[]} */
export default [
  // -----------------------------------------------------------------------
  // Global ignores
  // -----------------------------------------------------------------------
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "public/**",
      "*.config.*",
      "postcss.config.mjs",
      "payments.config.ts",
    ],
  },

  // -----------------------------------------------------------------------
  // Next.js recommended + core-web-vitals (flat config arrays)
  // -----------------------------------------------------------------------
  ...nextConfig,
  ...nextCoreWebVitals,

  // -----------------------------------------------------------------------
  // TypeScript strict type-checked rules
  // -----------------------------------------------------------------------
  ...tseslint.configs.strictTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.ts", "**/*.tsx"],
  })),

  // -----------------------------------------------------------------------
  // TypeScript parser options (project-aware linting)
  // -----------------------------------------------------------------------
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
  },

  // -----------------------------------------------------------------------
  // Custom rules for project source code
  // -----------------------------------------------------------------------
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    plugins: {
      "import-x": importPlugin,
    },
    rules: {
      // -- TypeScript strict --

      // Ban `any` — use `unknown` + type guards
      "@typescript-eslint/no-explicit-any": "error",

      // Ban `as` assertions — use type guards (exceptions below)
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],

      // Prefer `import type` for type-only imports
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],

      // Allow void expressions (used for `void variable` in TODO stubs)
      "@typescript-eslint/no-confusing-void-expression": "off",

      // Allow empty functions (event handler stubs)
      "@typescript-eslint/no-empty-function": "off",

      // Floating promises: allow `void` prefix for fire-and-forget
      "@typescript-eslint/no-floating-promises": [
        "error",
        { ignoreVoid: true },
      ],

      // Non-null assertions: warn (prefer optional chaining)
      "@typescript-eslint/no-non-null-assertion": "warn",

      // Unused vars: allow underscore-prefixed
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // Allow template expressions with numbers and booleans
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowNumber: true, allowBoolean: true },
      ],

      // -- React / Next.js --
      "@next/next/no-img-element": "warn",

      // -- Import ordering --
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          pathGroups: [
            { pattern: "@/**", group: "internal" },
          ],
        },
      ],
      "import-x/newline-after-import": "error",
      "import-x/no-duplicates": "error",

      // -- General --
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
      eqeqeq: ["error", "always"],
      "no-var": "error",
    },
  },

  // -----------------------------------------------------------------------
  // Stripe event handlers: stubs with async signature for future await usage
  // -----------------------------------------------------------------------
  {
    files: ["src/lib/stripe-events/**/*.ts"],
    rules: {
      "@typescript-eslint/require-await": "off",
    },
  },

  // -----------------------------------------------------------------------
  // Webhook route: allow `as` assertions for Stripe event.data.object
  // (Stripe types don't support discriminated unions on event type)
  // -----------------------------------------------------------------------
  {
    files: ["src/app/api/webhooks/stripe/route.ts"],
    rules: {
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "as", objectLiteralTypeAssertions: "never" },
      ],
    },
  },

  // -----------------------------------------------------------------------
  // shadcn/ui: skip strict linting on generated components
  // -----------------------------------------------------------------------
  {
    files: ["src/components/ui/**/*.tsx"],
    rules: {
      "@typescript-eslint/consistent-type-assertions": "off",
      "@typescript-eslint/consistent-type-imports": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-deprecated": "off",
      "@typescript-eslint/require-await": "off",
      "import-x/order": "off",
      "import-x/newline-after-import": "off",
      "import-x/no-duplicates": "off",
      eqeqeq: "off",
      "no-console": "off",
    },
  },

  // -----------------------------------------------------------------------
  // Hooks: relax some rules
  // -----------------------------------------------------------------------
  {
    files: ["src/hooks/**/*.ts", "src/hooks/**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
    },
  },
]
