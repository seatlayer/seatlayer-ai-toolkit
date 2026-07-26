#!/usr/bin/env node

import { runDoctorCli } from "../skills/integrate-seatlayer/scripts/doctor.mjs";

await runDoctorCli(process.argv.slice(2));
