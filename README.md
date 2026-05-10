# Command Vault

A Next.js app with two workspaces, selectable from a landing page:

- **Command Vault** (`/vault`) — save, search, tag, and organize shell commands. Backed by MySQL.
- **Local Cluster** (`/cluster`) — a local Kubernetes cluster (kind, 1 control-plane + 2 workers) with a button to create it and a live `kubectl get nodes` status panel.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Command Vault

Requires a running MySQL instance. See `schema.sql` for the table definition. Connection settings live in `src/lib/db.ts`.

## Local Cluster

The `/cluster` page manages a kind cluster named `command-vault`. Requires Docker Desktop and [`kind`](https://kind.sigs.k8s.io/) (`brew install kind`).

### Scripts:

```bash
./cluster/up.sh    # create the cluster (idempotent)
./cluster/down.sh  # delete the cluster
```

## Local MySQL DB

If you're running this project for the first time, you'll need to load the tables into the database. 
At the root of the repo:


```
  docker run -d \
    --name command-vault-mysql \
    -p 3306:3306 \
    -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
    -e MYSQL_DATABASE=command_vault \
    -v command-vault-mysql-data:/var/lib/mysql \
    mysql:8
```
  1. Wait for MySQL to be ready (poll mysqladmin ping)
  2. Then run to create commands, scenarios, and notes tables
```  
  docker exec -i command-vault-mysql mysql command_vault < schema.sql
```

The **Create Cluster** button on `/cluster` runs `up.sh` as a Next.js server action. The Nodes panel shows live `kubectl --context kind-command-vault get nodes -o wide` output.

### Topology

Defined in `cluster/kind-config.yaml`:

- 1 control-plane node
- 2 worker nodes

### Persistent storage

Each worker bind-mounts `cluster/data/worker{1,2}` (on the host) into `/var/local-path-provisioner` (inside the node). PVCs bound to the default `standard` StorageClass store their data on the host, so files written to PVCs survive `down.sh` → `up.sh`.

Caveats:

- **Only PVC file data persists.** Kubernetes objects (Deployments, Secrets, ConfigMaps, etc.) live in etcd and are wiped on `down.sh`. To keep those too, don't delete the cluster — just stop Docker; the containers come back with state intact.
- **PVC re-binding is by UID.** After `down.sh` → `up.sh`, a new PVC with the same namespace/name lands in a new directory. Reattaching existing data requires a static PV pointing at the specific path.
- `cluster/data/` is gitignored.

## Project layout

```
src/app/
  page.tsx          # landing page (workspace picker)
  vault/            # Command Vault UI
  cluster/          # Local Cluster UI (server actions + live node status)
  api/              # REST routes backing Command Vault
cluster/
  kind-config.yaml  # 1 control-plane + 2 workers, with persistent mounts
  up.sh / down.sh   # cluster lifecycle scripts
  data/             # host-side PVC storage (gitignored)
```
