export interface FileDetails {
  PK: string;
  id: string;
  path: string | File;
  isCover?: boolean;
  isPublic?: boolean;
  createdBy?: string;
  createdDate?: string;
  tags?: string[];
}

export interface PresignedUrlOutput {
  url?: string;
  path?: string;
}
