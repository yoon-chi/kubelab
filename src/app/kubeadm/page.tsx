import Markdown from "@/components/Markdown";

const GUIDE = `## Prerequisites

- 2+ Linux machines (Ubuntu 22.04/24.04 in this guide), one for the control plane and one or more workers.
- Each node: 2 CPU, 2 GB RAM minimum, full network connectivity between nodes, unique hostname/MAC/product_uuid.
- A user with \`sudo\`.

---

## 1. On every node (control-plane + workers)

### Disable swap

\`kubelet\` refuses to start with swap enabled.

\`\`\`bash
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab
\`\`\`

### Kernel modules + sysctls

\`\`\`bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay && sudo modprobe br_netfilter

cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
sudo sysctl --system
\`\`\`

### Install containerd (the container runtime)

\`\`\`bash
sudo apt-get update && sudo apt-get install -y containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml >/dev/null
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
sudo systemctl restart containerd && sudo systemctl enable containerd
\`\`\`

### Install kubeadm, kubelet, kubectl

Pinned to v1.31 — change the version in both URLs to match what you want.

\`\`\`bash
sudo apt-get install -y apt-transport-https ca-certificates curl gpg
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.31/deb/Release.key \\
  | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.31/deb/ /' \\
  | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
\`\`\`

---

## 2. On the control-plane node only

Pick a pod CIDR that matches your CNI:

- **Calico**: \`192.168.0.0/16\`
- **Flannel**: \`10.244.0.0/16\`

\`\`\`bash
sudo kubeadm init --pod-network-cidr=192.168.0.0/16
\`\`\`

When it finishes, **copy the printed \`kubeadm join …\` command** — you'll run it on each worker.

### Set up kubectl for your user

\`\`\`bash
mkdir -p $HOME/.kube
sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
\`\`\`

### Install a CNI (Calico example)

\`\`\`bash
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.28.0/manifests/calico.yaml
\`\`\`

Nodes flip to \`Ready\` once the CNI pods are up.

---

## 3. On each worker node

Paste the join command from step 2:

\`\`\`bash
sudo kubeadm join <control-plane-ip>:6443 \\
  --token <token> \\
  --discovery-token-ca-cert-hash sha256:<hash>
\`\`\`

Lost the join command? Regenerate it from the control plane:

\`\`\`bash
kubeadm token create --print-join-command
\`\`\`

---

## 4. Verify

From the control-plane node:

\`\`\`bash
kubectl get nodes -o wide
kubectl get pods -A
\`\`\`

All nodes should be \`Ready\` and every \`kube-system\` pod \`Running\`.

---

## Common gotchas

- **\`kubelet\` won't start** → \`journalctl -u kubelet -f\`. Usually swap is still on, cgroup driver mismatch, or containerd isn't configured for systemd cgroups.
- **Nodes stay \`NotReady\`** → CNI isn't installed yet, or its pods are crash-looping.
- **Single-node lab** (no workers): untaint the control plane so it'll schedule workloads:
  \`\`\`bash
  kubectl taint nodes --all node-role.kubernetes.io/control-plane-
  \`\`\`
- **Reset a botched node** and start over:
  \`\`\`bash
  sudo kubeadm reset -f
  sudo rm -rf /etc/cni/net.d $HOME/.kube
  \`\`\`
`;

export default function KubeadmGuidePage() {
  return (
    <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          🛠️ Spin up your own cluster using kubeadm
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
          End-to-end walkthrough for a multi-node Kubernetes cluster on Ubuntu using kubeadm,
          containerd, and Calico.
        </p>
      </header>

      <article className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-6 sm:p-8">
        <Markdown>{GUIDE}</Markdown>
      </article>
    </main>
  );
}
