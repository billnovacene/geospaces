export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      damp_mold_data: {
        Row: {
          condensation_risk: string | null
          created_at: string
          dew_point: number | null
          humidity: number | null
          id: string
          is_real: boolean | null
          mold_risk: string | null
          site_id: number | null
          surface_temperature: number | null
          temperature: number | null
          timestamp: string
          zone_id: number | null
        }
        Insert: {
          condensation_risk?: string | null
          created_at?: string
          dew_point?: number | null
          humidity?: number | null
          id?: string
          is_real?: boolean | null
          mold_risk?: string | null
          site_id?: number | null
          surface_temperature?: number | null
          temperature?: number | null
          timestamp?: string
          zone_id?: number | null
        }
        Update: {
          condensation_risk?: string | null
          created_at?: string
          dew_point?: number | null
          humidity?: number | null
          id?: string
          is_real?: boolean | null
          mold_risk?: string | null
          site_id?: number | null
          surface_temperature?: number | null
          temperature?: number | null
          timestamp?: string
          zone_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "damp_mold_data_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "damp_mold_data_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      devices: {
        Row: {
          created_at: string
          id: number
          is_removed: boolean | null
          model_id: string | null
          name: string
          project_id: number | null
          site_id: number | null
          status: string | null
          type: string | null
          type_id: number | null
          updated_at: string
          zone_id: number | null
        }
        Insert: {
          created_at?: string
          id: number
          is_removed?: boolean | null
          model_id?: string | null
          name: string
          project_id?: number | null
          site_id?: number | null
          status?: string | null
          type?: string | null
          type_id?: number | null
          updated_at?: string
          zone_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          is_removed?: boolean | null
          model_id?: string | null
          name?: string
          project_id?: number | null
          site_id?: number | null
          status?: string | null
          type?: string | null
          type_id?: number | null
          updated_at?: string
          zone_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "devices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devices_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      import_logs: {
        Row: {
          error_message: string | null
          finished_at: string | null
          id: string
          metadata: Json | null
          rows_imported: number | null
          source: string
          started_at: string
          status: string
        }
        Insert: {
          error_message?: string | null
          finished_at?: string | null
          id?: string
          metadata?: Json | null
          rows_imported?: number | null
          source: string
          started_at?: string
          status?: string
        }
        Update: {
          error_message?: string | null
          finished_at?: string | null
          id?: string
          metadata?: Json | null
          rows_imported?: number | null
          source?: string
          started_at?: string
          status?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          bb101: boolean | null
          created_at: string
          customer_id: number | null
          description: string | null
          id: number
          image: string | null
          name: string
          notification: boolean | null
          status: string | null
          trigger_device: boolean | null
          updated_at: string
        }
        Insert: {
          bb101?: boolean | null
          created_at?: string
          customer_id?: number | null
          description?: string | null
          id: number
          image?: string | null
          name: string
          notification?: boolean | null
          status?: string | null
          trigger_device?: boolean | null
          updated_at?: string
        }
        Update: {
          bb101?: boolean | null
          created_at?: string
          customer_id?: number | null
          description?: string | null
          id?: number
          image?: string | null
          name?: string
          notification?: boolean | null
          status?: string | null
          trigger_device?: boolean | null
          updated_at?: string
        }
        Relationships: []
      }
      Projects: {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      sensor_data: {
        Row: {
          id: string
          is_real: boolean | null
          sensor_id: string | null
          timestamp: string
          value: number | null
        }
        Insert: {
          id?: string
          is_real?: boolean | null
          sensor_id?: string | null
          timestamp: string
          value?: number | null
        }
        Update: {
          id?: string
          is_real?: boolean | null
          sensor_id?: string | null
          timestamp?: string
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sensor_data_sensor_id_fkey"
            columns: ["sensor_id"]
            isOneToOne: false
            referencedRelation: "sensors"
            referencedColumns: ["id"]
          },
        ]
      }
      sensors: {
        Row: {
          created_at: string
          device_id: number | null
          id: string
          last_updated: string | null
          name: string
          type: string | null
          unit: string | null
        }
        Insert: {
          created_at?: string
          device_id?: number | null
          id: string
          last_updated?: string | null
          name: string
          type?: string | null
          unit?: string | null
        }
        Update: {
          created_at?: string
          device_id?: number | null
          id?: string
          last_updated?: string | null
          name?: string
          type?: string | null
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sensors_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "devices"
            referencedColumns: ["id"]
          },
        ]
      }
      sites: {
        Row: {
          address: string | null
          created_at: string
          description: string | null
          id: number
          is_removed: boolean | null
          location: Json | null
          location_text: string | null
          name: string
          project_id: number
          status: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          description?: string | null
          id: number
          is_removed?: boolean | null
          location?: Json | null
          location_text?: string | null
          name: string
          project_id: number
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          description?: string | null
          id?: number
          is_removed?: boolean | null
          location?: Json | null
          location_text?: string | null
          name?: string
          project_id?: number
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      zones: {
        Row: {
          area: number | null
          created_at: string
          description: string | null
          fields: Json | null
          id: number
          is_removed: boolean | null
          location: Json | null
          name: string
          parent_id: number | null
          site_id: number
          status: string | null
          type: string | null
          updated_at: string
        }
        Insert: {
          area?: number | null
          created_at?: string
          description?: string | null
          fields?: Json | null
          id: number
          is_removed?: boolean | null
          location?: Json | null
          name: string
          parent_id?: number | null
          site_id: number
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Update: {
          area?: number | null
          created_at?: string
          description?: string | null
          fields?: Json | null
          id?: number
          is_removed?: boolean | null
          location?: Json | null
          name?: string
          parent_id?: number | null
          site_id?: number
          status?: string | null
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "zones_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zones_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
