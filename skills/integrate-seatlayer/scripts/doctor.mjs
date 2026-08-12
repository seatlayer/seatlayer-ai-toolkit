#!/usr/bin/env node

import { readdir, readFile, stat } from "node:fs/promises";
import { resolve, relative, extname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const IGNORED_DIRECTORIES = new Set([
  ".git",
  ".next",
  ".nuxt",
  ".output",
  ".turbo",
  ".vercel",
  ".wrangler",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
  "target",
  "vendor",
]);

const TEXT_EXTENSIONS = new Set([
  ".cjs",
  ".cs",
  ".env",
  ".go",
  ".html",
  ".java",
  ".js",
  ".json",
  ".jsx",
  ".md",
  ".mjs",
  ".php",
  ".py",
  ".rb",
  ".rs",
  ".svelte",
  ".toml",
  ".ts",
  ".tsx",
  ".vue",
  ".yaml",
  ".yml",
]);

const CODE_EXTENSIONS = new Set([
  ".cjs",
  ".cs",
  ".go",
  ".html",
  ".java",
  ".js",
  ".jsx",
  ".mjs",
  ".php",
  ".py",
  ".rb",
  ".rs",
  ".svelte",
  ".ts",
  ".tsx",
  ".vue",
]);

const SEVERITY_ORDER = {
  critical: 0,
  warning: 1,
  info: 2,
};

function normalizePath(value) {
  return value.split("\\").join("/");
}

function lineForIndex(content, index) {
  return content.slice(0, Math.max(index, 0)).split("\n").length;
}

function firstMatch(content, pattern) {
  const match = pattern.exec(content);
  pattern.lastIndex = 0;
  return match;
}

function isLikelyServerFile(relativePath) {
  const path = `/${normalizePath(relativePath).toLowerCase()}`;
  return [
    "/api/",
    "/backend/",
    "/functions/",
    "/server/",
    "/services/",
    "/workers/",
    ".server.",
    ".service.",
    "/route.",
    "/controller.",
    "/handler.",
  ].some((marker) => path.includes(marker));
}

function isLikelyClientFile(relativePath, content) {
  if (isLikelyServerFile(relativePath)) return false;

  const path = `/${normalizePath(relativePath).toLowerCase()}`;
  if (/^[\s;]*["']use client["'];?/m.test(content)) return true;

  return [
    "/app/",
    "/browser/",
    "/client/",
    "/components/",
    "/frontend/",
    "/pages/",
    "/ui/",
  ].some((marker) => path.includes(marker));
}

function isTestFile(relativePath) {
  const path = `/${normalizePath(relativePath).toLowerCase()}`;
  return (
    path.includes("/test/") ||
    path.includes("/tests/") ||
    path.includes("/fixtures/") ||
    /\.(?:spec|test)\.[^.]+$/.test(path)
  );
}

async function collectFiles(root) {
  const files = [];

  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isSymbolicLink()) continue;
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        if (!IGNORED_DIRECTORIES.has(entry.name)) await walk(path);
        continue;
      }
      if (!entry.isFile()) continue;

      const extension = extname(entry.name).toLowerCase();
      const isEnvFile = entry.name === ".env" || entry.name.startsWith(".env.");
      if (!TEXT_EXTENSIONS.has(extension) && !isEnvFile) continue;

      const details = await stat(path);
      if (details.size <= 1_000_000) files.push(path);
    }
  }

  await walk(root);
  return files;
}

function addFinding(findings, finding) {
  const duplicate = findings.some(
    (item) =>
      item.code === finding.code &&
      item.path === finding.path &&
      item.line === finding.line,
  );
  if (!duplicate) findings.push(finding);
}

export async function scanRepository(target = ".") {
  const root = resolve(target);
  const rootStat = await stat(root);
  if (!rootStat.isDirectory()) {
    throw new Error(`Target is not a directory: ${root}`);
  }

  const files = await collectFiles(root);
  const findings = [];
  let seatLayerDetected = false;
  let envExampleHasSecret = false;
  let seatLayerCodeFiles = 0;
  let serverBookingDetected = false;

  for (const file of files) {
    const relativePath = normalizePath(relative(root, file));
    const extension = extname(file).toLowerCase();
    const content = await readFile(file, "utf8");
    const isCode = CODE_EXTENSIONS.has(extension);
    const mentionsSeatLayer =
      /seatlayer/i.test(content) ||
      /SEATLAYER_[A-Z0-9_]+/.test(content) ||
      /@seatlayer\//.test(content);

    if (mentionsSeatLayer) {
      seatLayerDetected = true;
      if (isCode) seatLayerCodeFiles += 1;
    }

    if (
      [".env.example", ".env.sample"].includes(basename(file)) &&
      /SEATLAYER_SECRET_KEY\s*=/.test(content)
    ) {
      envExampleHasSecret = true;
    }

    const literalSecret = firstMatch(content, /\bsk_(?:test|live)_[A-Za-z0-9_-]{12,}\b/g);
    const secretContext = literalSecret
      ? content.slice(
          Math.max(0, literalSecret.index - 300),
          literalSecret.index + literalSecret[0].length + 300,
        )
      : "";
    const secretLooksSeatLayerSpecific =
      /SEATLAYER_SECRET_KEY|api\.seatlayer\.io|@seatlayer\//i.test(secretContext) ||
      /seatlayer/i.test(relativePath);
    const explicitFakeSecret =
      literalSecret &&
      /(?:dummy|example|fake|not[_-]?a[_-]?real|placeholder|never[_-]?(?:render|sent))/i.test(
        literalSecret[0],
      );
    if (
      literalSecret &&
      secretLooksSeatLayerSpecific &&
      !(isTestFile(relativePath) && explicitFakeSecret)
    ) {
      addFinding(findings, {
        code: "SL001",
        severity: "critical",
        path: relativePath,
        line: lineForIndex(content, literalSecret.index),
        message: "A SeatLayer secret-key-shaped literal is committed in text.",
        remediation:
          "Revoke the key, remove it from history, and load it from server-side secret management.",
      });
    }

    if (!isCode || !mentionsSeatLayer) continue;

    const likelyClient = isLikelyClientFile(relativePath, content);
    const serverSdkImport = firstMatch(
      content,
      /(?:from\s*["']@seatlayer\/server["']|require\s*\(\s*["']@seatlayer\/server["']\s*\))/g,
    );
    if (likelyClient && serverSdkImport) {
      addFinding(findings, {
        code: "SL004",
        severity: "critical",
        path: relativePath,
        line: lineForIndex(content, serverSdkImport.index),
        message: "Client-facing code imports the server-only SeatLayer SDK.",
        remediation:
          "Move @seatlayer/server and every secret-key operation behind the trusted server boundary.",
      });
    }

    const buyerCapabilityStorage = isTestFile(relativePath)
      ? null
      : firstMatch(
          content,
          /(?:(?:localStorage|sessionStorage|AsyncStorage)\s*\.\s*(?:setItem|set)\s*\([^\n)]{0,240}\b(?:buyerAccessToken|buyer_access_token|hostedAccessUrl|hosted_access_url)\b|(?:SharedPreferences|UserDefaults|searchParams)\b[^\n;]{0,240}\b(?:putString|set|append)\s*\([^\n)]{0,240}\b(?:buyerAccessToken|buyer_access_token|hostedAccessUrl|hosted_access_url)\b|(?:location\.(?:search|href)|(?:redirect|return|target)?url)\s*=\s*[^\n;]{0,240}\b(?:buyerAccessToken|buyer_access_token|hostedAccessUrl|hosted_access_url)\b)/gi,
        );
    if (buyerCapabilityStorage) {
      addFinding(findings, {
        code: "SL005",
        severity: "critical",
        path: relativePath,
        line: lineForIndex(content, buyerCapabilityStorage.index),
        message: "A buyer access capability may be persisted or placed in a URL.",
        remediation:
          "Keep buyer access tokens in memory and refresh through the trusted backend; never store them or put them in URLs.",
      });
    }

    const buyerCapabilityLog = isTestFile(relativePath)
      ? null
      : firstMatch(
          content,
          /(?:console\.(?:log|info|debug|warn|error)|logger\.(?:log|info|debug|warn|error))\s*\([^)]*(?:buyerAccessToken|buyer_access_token|hostedAccessUrl|hosted_access_url|bse_)/gi,
        );
    if (buyerCapabilityLog) {
      addFinding(findings, {
        code: "SL104",
        severity: "warning",
        path: relativePath,
        line: lineForIndex(content, buyerCapabilityLog.index),
        message: "Logging code may expose a buyer access capability.",
        remediation:
          "Log the session id and expiry only; never log buyer tokens or hosted access URLs.",
      });
    }
    const secretReference = firstMatch(
      content,
      /(?:process\.env\.|import\.meta\.env\.|env\s*\[\s*["']|getenv\(\s*["']|System\.getenv\(\s*["']|Environment\.GetEnvironmentVariable\(\s*["']|os\.environ\[\s*["']|ENV\.fetch\(\s*["'])SEATLAYER_SECRET_KEY\b/g,
    );
    if (likelyClient && secretReference) {
      addFinding(findings, {
        code: "SL002",
        severity: "critical",
        path: relativePath,
        line: lineForIndex(content, secretReference.index),
        message:
          "Client-facing code references the server-only SEATLAYER_SECRET_KEY.",
        remediation:
          "Move credential access and all authenticated SeatLayer API calls to a trusted server module.",
      });
    }

    const bookingCall = firstMatch(
      content,
      /(?:fetch|request|req|apiClient|httpClient|axios(?:\.\w+)?)\s*\(\s*[`'"][^`'"]*\/v1\/events\/[^`'"]+\/book/g,
    );
    if (bookingCall && likelyClient) {
      addFinding(findings, {
        code: "SL003",
        severity: "critical",
        path: relativePath,
        line: lineForIndex(content, bookingCall.index),
        message: "The SeatLayer booking endpoint is called from likely client code.",
        remediation:
          "Keep selection and holds in the browser; inspect and book the hold from a trusted server.",
      });
    }

    if (bookingCall && !likelyClient && !isTestFile(relativePath)) {
      serverBookingDetected = true;
      if (!/\bbookingRef\b/.test(content)) {
        addFinding(findings, {
          code: "SL101",
          severity: "warning",
          path: relativePath,
          line: lineForIndex(content, bookingCall.index),
          message: "A server booking call has no visible stable bookingRef.",
          remediation:
            "Use the host order id as bookingRef and reuse it for retries of the same order.",
        });
      }
      if (!/(?:\b409\b|conflict)/i.test(content)) {
        addFinding(findings, {
          code: "SL102",
          severity: "warning",
          path: relativePath,
          line: lineForIndex(content, bookingCall.index),
          message: "A server booking call has no visible inventory-conflict path.",
          remediation:
            "Handle HTTP 409 as a recoverable inventory conflict with deliberate buyer and order behavior.",
        });
      }
    }

    const secretLog = firstMatch(
      content,
      /(?:console\.(?:log|info|debug|warn|error)|logger\.(?:log|info|debug|warn|error))\s*\([^)]*(?:SEATLAYER_SECRET_KEY|authorization)/gi,
    );
    if (secretLog) {
      addFinding(findings, {
        code: "SL103",
        severity: "warning",
        path: relativePath,
        line: lineForIndex(content, secretLog.index),
        message: "Logging code may include a credential or authorization value.",
        remediation:
          "Log request identifiers and status only; never log secret keys or authorization headers.",
      });
    }

    const channelOverride = firstMatch(
      content,
      /ignoreChannelRestrictions\s*[:=]\s*true/g,
    );
    if (channelOverride && !/\breason\s*[:=]/.test(content)) {
      addFinding(findings, {
        code: "SL105",
        severity: "warning",
        path: relativePath,
        line: lineForIndex(content, channelOverride.index),
        message: "A privileged channel restriction override has no visible audit reason.",
        remediation:
          "Use the override only for a genuine back-office action and send a short, non-sensitive reason.",
      });
    }

    const normalizedRelativePath = normalizePath(relativePath).toLowerCase();
    const readsSeatLayerSignature =
      /(?:headers?\s*\.\s*(?:get|at)\s*\(\s*["']x-seatlayer-signature["']|headers?\s*\[\s*["']x-seatlayer-signature["']\s*\]|x-seatlayer-signature.{0,80}(?:request|req)\.headers?)/is.test(
        content,
      );
    const webhookContext =
      extension !== ".html" &&
      /webhook/.test(normalizedRelativePath) &&
      readsSeatLayerSignature &&
      /\b(?:request|req|handler|post)\b/i.test(content) &&
      !isTestFile(relativePath);
    if (
      webhookContext &&
      !/(?:timingSafeEqual|createHmac|verify.{0,40}signature|signature.{0,40}verify)/is.test(
        content,
      )
    ) {
      addFinding(findings, {
        code: "SL201",
        severity: "warning",
        path: relativePath,
        line: 1,
        message: "A SeatLayer webhook path has no visible signature verification.",
        remediation:
          "Verify the documented signature against the exact raw request body before mutating business state.",
      });
    }
  }

  if (serverBookingDetected && !envExampleHasSecret) {
    addFinding(findings, {
      code: "SL202",
      severity: "info",
      path: ".",
      line: 1,
      message:
        "No .env.example or .env.sample documents SEATLAYER_SECRET_KEY.",
      remediation:
        "Document the variable name without committing a value when the integration uses the server API.",
    });
  }

  findings.sort(
    (a, b) =>
      SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] ||
      a.path.localeCompare(b.path) ||
      a.line - b.line ||
      a.code.localeCompare(b.code),
  );

  const summary = {
    critical: findings.filter((item) => item.severity === "critical").length,
    warning: findings.filter((item) => item.severity === "warning").length,
    info: findings.filter((item) => item.severity === "info").length,
  };

  return {
    root,
    status: seatLayerDetected ? "detected" : "not-detected",
    filesScanned: files.length,
    seatLayerCodeFiles,
    summary,
    findings,
  };
}

function formatHumanReport(report) {
  const lines = [
    "SeatLayer Doctor",
    `Target: ${report.root}`,
    `Status: ${report.status}`,
    `Scanned: ${report.filesScanned} text files (${report.seatLayerCodeFiles} SeatLayer code files)`,
    "",
  ];

  if (report.findings.length === 0) {
    lines.push(
      report.status === "not-detected"
        ? "No SeatLayer integration code was detected."
        : "No deterministic safety findings.",
    );
  } else {
    for (const finding of report.findings) {
      lines.push(
        `[${finding.severity.toUpperCase()}] ${finding.code} ${finding.path}:${finding.line}`,
        `  ${finding.message}`,
        `  Fix: ${finding.remediation}`,
        "",
      );
    }
  }

  lines.push(
    `Summary: ${report.summary.critical} critical · ${report.summary.warning} warnings · ${report.summary.info} info`,
  );
  return lines.join("\n");
}

export async function runDoctorCli(args = process.argv.slice(2)) {
  const json = args.includes("--json");
  const strict = args.includes("--strict");
  const target =
    args.find((argument) => !argument.startsWith("--")) ?? process.cwd();

  try {
    const report = await scanRepository(target);
    process.stdout.write(
      json
        ? `${JSON.stringify(report, null, 2)}\n`
        : `${formatHumanReport(report)}\n`,
    );

    if (report.summary.critical > 0) process.exitCode = 2;
    else if (strict && report.summary.warning > 0) process.exitCode = 1;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    if (json) {
      process.stdout.write(
        `${JSON.stringify({ status: "error", error: message }, null, 2)}\n`,
      );
    } else {
      process.stderr.write(`SeatLayer Doctor failed: ${message}\n`);
    }
    process.exitCode = 3;
  }
}

const isDirectExecution =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === resolve(process.argv[1]);

if (isDirectExecution) {
  await runDoctorCli();
}
