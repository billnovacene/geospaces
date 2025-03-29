
export interface ImportLog {
  id: string;
  source: string;
  started_at: string;
  finished_at: string | null;
  status: string; // String type to match Supabase data
  rows_imported: number;
  error_message: string | null;
  metadata: any;
}
