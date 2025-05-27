export interface DocumentInput {
  inputs: {
    document: {
      type: string;
      transfer_method: string;
      remote_url?: string;
      upload_file_id?: string;
    };
  }
  workflow_id: string;
  user: string;
}

export interface DocumentOutput {
  document_title: string;
  document_description: string;
  theme: string;
  sub_themes: string[];
  project: string;
  category: string;
  sub_category: string;
  document_type: string;
  languages: string[];
  state: string;
  districts: string[];
  implementation_partner: string;
  funding_agency: string;
  tags: string[];
}

export interface UploadResponse {
  id: string;
  name: string;
  size: number;
  extension: string;
  mime_type: string;
  created_by: string;
  created_at: number;
}

export interface ApiResponse {
  task_id: string;
  workflow_run_id: string;
  data: {
    id: string;
    workflow_id: string;
    status: string;
    outputs: {
      output: DocumentOutput;
    };
    error: null | string;
    elapsed_time: number;
    total_tokens: number;
    total_steps: number;
    created_at: number;
    finished_at: number;
  };
} 