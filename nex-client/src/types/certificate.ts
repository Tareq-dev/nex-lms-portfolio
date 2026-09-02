export type CertificateType =
  | "Professional"
  | "Masterclass"
  | "Workshop";

export interface Certificate {
  id: string;
  title: string;
  instructor: string;
  issueDate: string;
  credentialUrl: string;
  grade: string;
  type: CertificateType;
  isFeatured: boolean;
}