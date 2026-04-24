#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

if ! command -v kind >/dev/null 2>&1; then
  echo "kind is not installed. Install via: brew install kind" >&2
  exit 1
fi

mkdir -p data/worker1 data/worker2

if kind get clusters | grep -qx command-vault; then
  echo "Cluster 'command-vault' already exists."
else
  kind create cluster --config kind-config.yaml
fi

kubectl --context kind-command-vault get nodes
