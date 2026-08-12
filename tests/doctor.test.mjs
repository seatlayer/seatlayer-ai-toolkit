import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import { scanRepository } from "../skills/integrate-seatlayer/scripts/doctor.mjs";

async function fixture(files) {
  const root = await mkdtemp(join(tmpdir(), "seatlayer-doctor-"));
  for (const [relativePath, content] of Object.entries(files)) {
    const path = join(root, relativePath);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
  return root;
}

test("reports no integration when SeatLayer is absent", async () => {
  const root = await fixture({
    "src/index.ts": "export const answer = 42;\n",
  });

  const report = await scanRepository(root);

  assert.equal(report.status, "not-detected");
  assert.deepEqual(report.summary, { critical: 0, warning: 0, info: 0 });
});

test("accepts a server booking flow with idempotency and conflict handling", async () => {
  const root = await fixture({
    ".env.example": "SEATLAYER_SECRET_KEY=\n",
    "server/api/checkout.ts": `
      const response = await fetch(
        "https://api.seatlayer.io/v1/events/" + eventKey + "/book",
        {
          method: "POST",
          headers: { authorization: "Bearer " + process.env.SEATLAYER_SECRET_KEY },
          body: JSON.stringify({ holdId, bookingRef: order.id }),
        },
      );
      if (response.status === 409) return { kind: "conflict" };
    `,
    "src/components/Picker.tsx": `
      "use client";
      import { SeatPicker } from "@seatlayer/react";
      export function Picker() { return <SeatPicker event="ev_test" />; }
    `,
  });

  const report = await scanRepository(root);

  assert.equal(report.status, "detected");
  assert.equal(report.summary.critical, 0);
  assert.equal(report.summary.warning, 0);
});

test("flags secrets and booking calls in client code", async () => {
  const root = await fixture({
    "src/components/Checkout.tsx": `
      "use client";
      const key = process.env.SEATLAYER_SECRET_KEY;
      fetch("https://api.seatlayer.io/v1/events/ev_123/book", {
        headers: { authorization: "Bearer sk_test_abcdefghijklmnop" },
      });
    `,
  });

  const report = await scanRepository(root);
  const codes = new Set(report.findings.map((finding) => finding.code));

  assert.equal(report.summary.critical, 3);
  assert(codes.has("SL001"));
  assert(codes.has("SL002"));
  assert(codes.has("SL003"));
});

test("does not treat UI guidance or another provider's test key as a SeatLayer secret", async () => {
  const root = await fixture({
    "src/pages/DeveloperHelp.tsx": `
      export function DeveloperHelp() {
        return <code>Keep SEATLAYER_SECRET_KEY on your server.</code>;
      }
    `,
    "server/payments/stripe.ts": `
      export const verifier = stripeClient("sk_test_verification_only_never_sent");
    `,
  });

  const report = await scanRepository(root);

  assert.equal(report.summary.critical, 0);
});

test("warns when a SeatLayer webhook has no visible signature verification", async () => {
  const root = await fixture({
    ".env.example": "SEATLAYER_SECRET_KEY=\n",
    "server/webhooks/seatlayer.ts": `
      export async function seatlayerWebhook(request) {
        const signature = request.headers.get("x-seatlayer-signature");
        const event = await request.json();
        await saveSeatLayerEvent(event, signature);
      }
    `,
  });

  const report = await scanRepository(root);

  assert.equal(report.summary.critical, 0);
  assert.equal(report.summary.warning, 1);
  assert.equal(report.findings[0].code, "SL201");
});

test("flags missing idempotency and conflict handling on a server booking call", async () => {
  const root = await fixture({
    "server/api/checkout.ts": `
      export async function book(eventKey, holdId) {
        return fetch(\`https://api.seatlayer.io/v1/events/\${eventKey}/book\`, {
          method: "POST",
          headers: { authorization: "Bearer " + process.env.SEATLAYER_SECRET_KEY },
          body: JSON.stringify({ holdId }),
        });
      }
    `,
  });

  const report = await scanRepository(root);
  const codes = new Set(report.findings.map((finding) => finding.code));

  assert.equal(report.summary.critical, 0);
  assert.equal(report.summary.warning, 2);
  assert(codes.has("SL101"));
  assert(codes.has("SL102"));
});

test("flags the server SDK when imported by client-facing code", async () => {
  const root = await fixture({
    "src/components/Checkout.tsx": `
      "use client";
      import { SeatLayer } from "@seatlayer/server";
      export const client = new SeatLayer("not-a-real-key");
    `,
  });

  const report = await scanRepository(root);

  assert.equal(report.summary.critical, 1);
  assert.equal(report.findings[0].code, "SL004");
});

test("flags persisted and logged buyer access capabilities", async () => {
  const root = await fixture({
    "src/components/PrivatePicker.tsx": `
      "use client";
      import { SeatingChart } from "@seatlayer/js";
      const buyerAccessToken = await getSeatLayerAccess();
      localStorage.setItem("buyerAccessToken", buyerAccessToken);
      console.info("SeatLayer access", buyerAccessToken);
      export const chart = new SeatingChart({ buyerAccessToken });
    `,
  });

  const report = await scanRepository(root);
  const codes = new Set(report.findings.map((finding) => finding.code));

  assert.equal(report.summary.critical, 1);
  assert.equal(report.summary.warning, 1);
  assert(codes.has("SL005"));
  assert(codes.has("SL104"));
});

test("requires an audit reason for a privileged channel override", async () => {
  const root = await fixture({
    "server/api/box-office.ts": `
      export async function seatLayerOverride() {
        return book({
          ignoreChannelRestrictions: true,
          labels: ["A-1"],
        });
      }
    `,
  });

  const report = await scanRepository(root);

  assert.equal(report.summary.critical, 0);
  assert.equal(report.summary.warning, 1);
  assert.equal(report.findings[0].code, "SL105");
});
