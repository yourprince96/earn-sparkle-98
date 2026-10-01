export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      app_settings: {
        Row: {
          ad_bottom: string
          ad_interstitial: string
          ad_middle: string
          ad_top: string
          bkash_number: string
          id: number
          nagad_number: string
          spin_fee: number
          spin_prizes: Json
          support_email: string
          support_telegram: string
          support_whatsapp: string
          updated_at: string
        }
        Insert: {
          ad_bottom?: string
          ad_interstitial?: string
          ad_middle?: string
          ad_top?: string
          bkash_number?: string
          id?: number
          nagad_number?: string
          spin_fee?: number
          spin_prizes?: Json
          support_email?: string
          support_telegram?: string
          support_whatsapp?: string
          updated_at?: string
        }
        Update: {
          ad_bottom?: string
          ad_interstitial?: string
          ad_middle?: string
          ad_top?: string
          bkash_number?: string
          id?: number
          nagad_number?: string
          spin_fee?: number
          spin_prizes?: Json
          support_email?: string
          support_telegram?: string
          support_whatsapp?: string
          updated_at?: string
        }
        Relationships: []
      }
      fraud_reviews: {
        Row: {
          activity_input: string
          created_at: string
          created_by: string | null
          id: string
          patterns: Json
          recommended_action: string
          reviewed_label: string
          reviewed_user_id: string | null
          risk_level: string
          risk_score: number
          source: string
          summary: string
          updated_at: string
        }
        Insert: {
          activity_input?: string
          created_at?: string
          created_by?: string | null
          id?: string
          patterns?: Json
          recommended_action?: string
          reviewed_label?: string
          reviewed_user_id?: string | null
          risk_level?: string
          risk_score?: number
          source?: string
          summary?: string
          updated_at?: string
        }
        Update: {
          activity_input?: string
          created_at?: string
          created_by?: string | null
          id?: string
          patterns?: Json
          recommended_action?: string
          reviewed_label?: string
          reviewed_user_id?: string | null
          risk_level?: string
          risk_score?: number
          source?: string
          summary?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          balance: number
          created_at: string
          email: string
          full_name: string
          id: string
          is_blocked: boolean
          referral_code: string
          referral_earning: number
          referred_by: string | null
          total_withdrawn: number
          vip_expires_at: string | null
          vip_plan_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          balance?: number
          created_at?: string
          email: string
          full_name?: string
          id: string
          is_blocked?: boolean
          referral_code: string
          referral_earning?: number
          referred_by?: string | null
          total_withdrawn?: number
          vip_expires_at?: string | null
          vip_plan_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          balance?: number
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_blocked?: boolean
          referral_code?: string
          referral_earning?: number
          referred_by?: string | null
          total_withdrawn?: number
          vip_expires_at?: string | null
          vip_plan_id?: string | null
        }
        Relationships: []
      }
      promo_codes: {
        Row: {
          amount: number
          code: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          max_uses: number
          used_count: number
        }
        Insert: {
          amount?: number
          code: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          used_count?: number
        }
        Update: {
          amount?: number
          code?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          max_uses?: number
          used_count?: number
        }
        Relationships: []
      }
      promo_redemptions: {
        Row: {
          amount: number
          code_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          code_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          code_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_redemptions_code_id_fkey"
            columns: ["code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      spins: {
        Row: {
          created_at: string
          fee: number
          id: string
          prize: number
          user_id: string
        }
        Insert: {
          created_at?: string
          fee: number
          id?: string
          prize: number
          user_id: string
        }
        Update: {
          created_at?: string
          fee?: number
          id?: string
          prize?: number
          user_id?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          admin_reply: string | null
          created_at: string
          id: string
          message: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          message: string
          status?: string
          subject: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          admin_reply?: string | null
          created_at?: string
          id?: string
          message?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      task_completions: {
        Row: {
          created_at: string
          id: string
          reward: number
          task_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reward?: number
          task_id?: string | null
          title?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reward?: number
          task_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_starts: {
        Row: {
          id: string
          started_at: string
          task_id: string
          used: boolean
          user_id: string
        }
        Insert: {
          id?: string
          started_at?: string
          task_id: string
          used?: boolean
          user_id: string
        }
        Update: {
          id?: string
          started_at?: string
          task_id?: string
          used?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_starts_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_submissions: {
        Row: {
          category: string
          created_at: string
          id: string
          note: string | null
          processed_at: string | null
          proof_path: string | null
          proof_text: string
          reward: number
          status: string
          task_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          proof_path?: string | null
          proof_text?: string
          reward?: number
          status?: string
          task_id?: string | null
          title?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          note?: string | null
          processed_at?: string | null
          proof_path?: string | null
          proof_text?: string
          reward?: number
          status?: string
          task_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_submissions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category: string
          created_at: string
          daily_limit: number
          description: string
          duration_seconds: number
          icon: string
          id: string
          instructions: string
          is_active: boolean
          kind: string
          link: string | null
          reward: number
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          daily_limit?: number
          description?: string
          duration_seconds?: number
          icon?: string
          id?: string
          instructions?: string
          is_active?: boolean
          kind?: string
          link?: string | null
          reward?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          daily_limit?: number
          description?: string
          duration_seconds?: number
          icon?: string
          id?: string
          instructions?: string
          is_active?: boolean
          kind?: string
          link?: string | null
          reward?: number
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vip_plans: {
        Row: {
          created_at: string
          duration_days: number
          id: string
          is_active: boolean
          name: string
          perks: string
          price: number
        }
        Insert: {
          created_at?: string
          duration_days?: number
          id?: string
          is_active?: boolean
          name: string
          perks?: string
          price?: number
        }
        Update: {
          created_at?: string
          duration_days?: number
          id?: string
          is_active?: boolean
          name?: string
          perks?: string
          price?: number
        }
        Relationships: []
      }
      vip_purchases: {
        Row: {
          amount: number
          created_at: string
          id: string
          method: string
          note: string | null
          plan_id: string | null
          plan_name: string
          processed_at: string | null
          sender_number: string | null
          status: string
          trx_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          method: string
          note?: string | null
          plan_id?: string | null
          plan_name?: string
          processed_at?: string | null
          sender_number?: string | null
          status?: string
          trx_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          method?: string
          note?: string | null
          plan_id?: string | null
          plan_name?: string
          processed_at?: string | null
          sender_number?: string | null
          status?: string
          trx_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vip_purchases_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "vip_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawals: {
        Row: {
          account_number: string
          amount: number
          created_at: string
          id: string
          method: string
          note: string | null
          processed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          account_number: string
          amount: number
          created_at?: string
          id?: string
          method: string
          note?: string | null
          processed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          account_number?: string
          amount?: number
          created_at?: string
          id?: string
          method?: string
          note?: string | null
          processed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_stats: { Args: never; Returns: Json }
      buy_vip_wallet: { Args: { _plan_id: string }; Returns: undefined }
      claim_task: { Args: { _task_id: string }; Returns: number }
      grant_vip: {
        Args: {
          _plan: Database["public"]["Tables"]["vip_plans"]["Row"]
          _uid: string
        }
        Returns: undefined
      }
      has_active_vip: { Args: { _uid: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      play_spin: { Args: never; Returns: Json }
      redeem_code: { Args: { _code: string }; Returns: number }
      request_vip_manual: {
        Args: {
          _method: string
          _plan_id: string
          _sender: string
          _trx: string
        }
        Returns: undefined
      }
      request_withdrawal: {
        Args: { _account: string; _amount: number; _method: string }
        Returns: string
      }
      review_task_submission: {
        Args: { _approve: boolean; _id: string; _note?: string }
        Returns: undefined
      }
      review_vip_purchase: {
        Args: { _approve: boolean; _id: string }
        Returns: undefined
      }
      review_withdrawal: {
        Args: { _approve: boolean; _id: string; _note?: string }
        Returns: undefined
      }
      start_task: { Args: { _task_id: string }; Returns: string }
      submit_task_proof: {
        Args: { _proof_path: string; _proof_text: string; _task_id: string }
        Returns: string
      }
      today_earning: { Args: never; Returns: number }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
