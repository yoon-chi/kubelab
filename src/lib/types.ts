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
  "Ingress",
  "ConfigMap",
  "Secret",
  "PersistentVolume",
  "PersistentVolumeClaim",
  "StorageClass",
  "Namespace",
  "Node",
  "ServiceAccount",
  "Role",
  "RoleBinding",
  "ClusterRole",
  "ClusterRoleBinding",
  "NetworkPolicy",
  "HorizontalPodAutoscaler",
  "Other",
] as const;
