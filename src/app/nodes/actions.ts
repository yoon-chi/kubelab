"use server";

import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { randomBytes } from "node:crypto";
import { revalidatePath } from "next/cache";

const run = promisify(execFile);

export type NodeInfo = {
  name: string;
  id: string;
  state: string;
  status: string;
  image: string;
};

const NAME_PREFIX = "kubelab-node-";
const NAME_RE = /^kubelab-node-[a-z0-9-]+$/;

export async function listNodes(): Promise<NodeInfo[]> {
  try {
    const { stdout } = await run(
      "docker",
      [
        "ps",
        "-a",
        "--filter",
        `name=^${NAME_PREFIX}`,
        "--format",
        "{{.Names}}\t{{.ID}}\t{{.State}}\t{{.Status}}\t{{.Image}}",
      ],
      { timeout: 5000 },
    );
    return stdout
      .split("\n")
      .filter(Boolean)
      .map((line) => {
        const [name, id, state, status, image] = line.split("\t");
        return { name, id, state, status, image };
      })
      .filter((n) => NAME_RE.test(n.name));
  } catch {
    return [];
  }
}

export async function createNode(): Promise<void> {
  const suffix = randomBytes(3).toString("hex");
  const name = `${NAME_PREFIX}${suffix}`;
  await run(
    "docker",
    [
      "run",
      "-d",
      "--name",
      name,
      "--hostname",
      name,
      "ubuntu:22.04",
      "sleep",
      "infinity",
    ],
    { timeout: 60_000 },
  );
  revalidatePath("/nodes");
}

export async function startNode(name: string): Promise<void> {
  if (!NAME_RE.test(name)) throw new Error("invalid name");
  await run("docker", ["start", name], { timeout: 30_000 });
  revalidatePath("/nodes");
}

export async function stopNode(name: string): Promise<void> {
  if (!NAME_RE.test(name)) throw new Error("invalid name");
  await run("docker", ["stop", name], { timeout: 30_000 });
  revalidatePath("/nodes");
}

export async function deleteNode(name: string): Promise<void> {
  if (!NAME_RE.test(name)) throw new Error("invalid name");
  await run("docker", ["rm", "-f", name], { timeout: 30_000 });
  revalidatePath("/nodes");
}
