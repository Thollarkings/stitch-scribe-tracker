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
      measurements: {
        Row: {
          ankle: number | null
          calf: number | null
          chest: number | null
          collectiondate: string | null
          collectiondatetype: string | null
          crotch: number | null
          delivery_date: string | null
          email: string | null
          gender: string | null
          gownlength: number | null
          halflength: number | null
          head: number | null
          hips: number | null
          id: string
          inseam: number | null
          insidelegseam: number | null
          name: string
          neck: number | null
          nippletonipple: number | null
          notes: string | null
          outseam: number | null
          phone: string | null
          roundsleeve: number | null
          shoulders: number | null
          shouldertonipple: number | null
          shouldertoshoulder: number | null
          shouldertounderbust: number | null
          shouldertowaist: number | null
          sleeve_length: number | null
          status: string | null
          thigh: number | null
          timestamp: string | null
          toplength: number | null
          trouserwaist: number | null
          user_id: string
          waist: number | null
          waisttoknee: number | null
        }
        Insert: {
          ankle?: number | null
          calf?: number | null
          chest?: number | null
          collectiondate?: string | null
          collectiondatetype?: string | null
          crotch?: number | null
          delivery_date?: string | null
          email?: string | null
          gender?: string | null
          gownlength?: number | null
          halflength?: number | null
          head?: number | null
          hips?: number | null
          id?: string
          inseam?: number | null
          insidelegseam?: number | null
          name: string
          neck?: number | null
          nippletonipple?: number | null
          notes?: string | null
          outseam?: number | null
          phone?: string | null
          roundsleeve?: number | null
          shoulders?: number | null
          shouldertonipple?: number | null
          shouldertoshoulder?: number | null
          shouldertounderbust?: number | null
          shouldertowaist?: number | null
          sleeve_length?: number | null
          status?: string | null
          thigh?: number | null
          timestamp?: string | null
          toplength?: number | null
          trouserwaist?: number | null
          user_id: string
          waist?: number | null
          waisttoknee?: number | null
        }
        Update: {
          ankle?: number | null
          calf?: number | null
          chest?: number | null
          collectiondate?: string | null
          collectiondatetype?: string | null
          crotch?: number | null
          delivery_date?: string | null
          email?: string | null
          gender?: string | null
          gownlength?: number | null
          halflength?: number | null
          head?: number | null
          hips?: number | null
          id?: string
          inseam?: number | null
          insidelegseam?: number | null
          name?: string
          neck?: number | null
          nippletonipple?: number | null
          notes?: string | null
          outseam?: number | null
          phone?: string | null
          roundsleeve?: number | null
          shoulders?: number | null
          shouldertonipple?: number | null
          shouldertoshoulder?: number | null
          shouldertounderbust?: number | null
          shouldertowaist?: number | null
          sleeve_length?: number | null
          status?: string | null
          thigh?: number | null
          timestamp?: string | null
          toplength?: number | null
          trouserwaist?: number | null
          user_id?: string
          waist?: number | null
          waisttoknee?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
