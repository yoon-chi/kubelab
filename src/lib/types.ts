export interface Command {
  id: number;
  title: string;
  command: string;
  description: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CommandInput {
  title: string;
  command: string;
  description?: string;
  tags?: string[];
}

export type Exam = "cka" | "ckad";

export interface Scenario {
  id: number;
  exam: Exam;
  question: string;
  answer: string;
  chapter: string;
  created_at: string;
  updated_at: string;
}

export interface ScenarioInput {
  exam: Exam;
  question: string;
  answer: string;
  chapter?: string;
}

export interface Note {
  id: number;
  resource: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface NoteInput {
  resource: string;
  title: string;
  content: string;
}

export const KUBERNETES_RESOURCES = [
  "Pod",
  "Deployment",
  "ReplicaSet",
  "StatefulSet",
  "DaemonSet",
  "Job",
  "CronJob",
  "Service",
  "Endpoints",
  "EndpointSlice",
  "Ingress",
  "IngressClass",
  "NetworkPolicy",
  "ConfigMap",
  "Secret",
  "PersistentVolume",
  "PersistentVolumeClaim",
  "StorageClass",
  "VolumeAttachment",
  "CSIDriver",
  "Namespace",
  "Node",
  "ResourceQuota",
  "LimitRange",
  "ServiceAccount",
  "Role",
  "RoleBinding",
  "ClusterRole",
  "ClusterRoleBinding",
  "HorizontalPodAutoscaler",
  "PodDisruptionBudget",
  "PriorityClass",
  "CustomResourceDefinition",
  "Event",
  "Lease",
  "MutatingWebhookConfiguration",
  "ValidatingWebhookConfiguration",
] as const;

export type KubernetesResource = (typeof KUBERNETES_RESOURCES)[number];

export const isKubernetesResource = (v: unknown): v is KubernetesResource =>
  typeof v === "string" &&
  (KUBERNETES_RESOURCES as readonly string[]).includes(v);

export interface Concept {
  id: number;
  category: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ConceptInput {
  category: string;
  title: string;
  content: string;
}

export const KUBERNETES_CONCEPTS = [
  "Workloads",
  "Networking",
  "Storage",
  "Configuration",
  "Security",
  "Scheduling",
  "Autoscaling",
  "Observability",
  "Cluster Architecture",
  "API & Extensibility",
  "Multi-tenancy",
  "Troubleshooting",
  "DevOps & CI/CD & GitOps",
  "Deployments"
] as const;

export type KubernetesConcept = (typeof KUBERNETES_CONCEPTS)[number];

export const isKubernetesConcept = (v: unknown): v is KubernetesConcept =>
  typeof v === "string" &&
  (KUBERNETES_CONCEPTS as readonly string[]).includes(v);
