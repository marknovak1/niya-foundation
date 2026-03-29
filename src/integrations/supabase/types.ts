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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      business_listings: {
        Row: {
          category: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          location: string | null
          name: string
          price: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          location?: string | null
          name: string
          price?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          location?: string | null
          name?: string
          price?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string
          name: string
          newsletter_optin: boolean | null
          phone: string | null
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          inquiry_type: string
          message: string
          name: string
          newsletter_optin?: boolean | null
          phone?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string
          name?: string
          newsletter_optin?: boolean | null
          phone?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      event_registrations: {
        Row: {
          created_at: string
          email: string
          event_id: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string | null
        }
        Insert: {
          created_at?: string
          email: string
          event_id: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          event_id?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          description: string | null
          description_ar: string | null
          description_es: string | null
          description_fr: string | null
          description_ru: string | null
          description_zh: string | null
          end_date: string | null
          event_date: string
          id: string
          image_url: string | null
          is_campaign: boolean | null
          is_published: boolean | null
          location: string | null
          location_url: string | null
          max_attendees: number | null
          registration_url: string | null
          title: string
          title_ar: string | null
          title_es: string | null
          title_fr: string | null
          title_ru: string | null
          title_zh: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          description_es?: string | null
          description_fr?: string | null
          description_ru?: string | null
          description_zh?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          image_url?: string | null
          is_campaign?: boolean | null
          is_published?: boolean | null
          location?: string | null
          location_url?: string | null
          max_attendees?: number | null
          registration_url?: string | null
          title: string
          title_ar?: string | null
          title_es?: string | null
          title_fr?: string | null
          title_ru?: string | null
          title_zh?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          description_es?: string | null
          description_fr?: string | null
          description_ru?: string | null
          description_zh?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          image_url?: string | null
          is_campaign?: boolean | null
          is_published?: boolean | null
          location?: string | null
          location_url?: string | null
          max_attendees?: number | null
          registration_url?: string | null
          title?: string
          title_ar?: string | null
          title_es?: string | null
          title_fr?: string | null
          title_ru?: string | null
          title_zh?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      membership_registrations: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string
          first_name: string
          how_heard: string | null
          id: string
          interests: string[] | null
          last_name: string
          membership_tier: string
          newsletter_optin: boolean | null
          organization: string | null
          phone: string | null
          postal_code: string | null
          status: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email: string
          first_name: string
          how_heard?: string | null
          id?: string
          interests?: string[] | null
          last_name: string
          membership_tier: string
          newsletter_optin?: boolean | null
          organization?: string | null
          phone?: string | null
          postal_code?: string | null
          status?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string
          first_name?: string
          how_heard?: string | null
          id?: string
          interests?: string[] | null
          last_name?: string
          membership_tier?: string
          newsletter_optin?: boolean | null
          organization?: string | null
          phone?: string | null
          postal_code?: string | null
          status?: string | null
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          author: string
          category: string
          content: string | null
          content_ar: string | null
          content_es: string | null
          content_fr: string | null
          content_ru: string | null
          content_zh: string | null
          created_at: string
          excerpt: string
          excerpt_ar: string | null
          excerpt_es: string | null
          excerpt_fr: string | null
          excerpt_ru: string | null
          excerpt_zh: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          title: string
          title_ar: string | null
          title_es: string | null
          title_fr: string | null
          title_ru: string | null
          title_zh: string | null
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content?: string | null
          content_ar?: string | null
          content_es?: string | null
          content_fr?: string | null
          content_ru?: string | null
          content_zh?: string | null
          created_at?: string
          excerpt: string
          excerpt_ar?: string | null
          excerpt_es?: string | null
          excerpt_fr?: string | null
          excerpt_ru?: string | null
          excerpt_zh?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          title: string
          title_ar?: string | null
          title_es?: string | null
          title_fr?: string | null
          title_ru?: string | null
          title_zh?: string | null
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string | null
          content_ar?: string | null
          content_es?: string | null
          content_fr?: string | null
          content_ru?: string | null
          content_zh?: string | null
          created_at?: string
          excerpt?: string
          excerpt_ar?: string | null
          excerpt_es?: string | null
          excerpt_fr?: string | null
          excerpt_ru?: string | null
          excerpt_zh?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          title?: string
          title_ar?: string | null
          title_es?: string | null
          title_fr?: string | null
          title_ru?: string | null
          title_zh?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          id: string
          interests: string[] | null
          is_active: boolean | null
          name: string | null
          segment: Database["public"]["Enums"]["contact_segment"] | null
          subscriber_type: string | null
          unsubscribed_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          name?: string | null
          segment?: Database["public"]["Enums"]["contact_segment"] | null
          subscriber_type?: string | null
          unsubscribed_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          name?: string | null
          segment?: Database["public"]["Enums"]["contact_segment"] | null
          subscriber_type?: string | null
          unsubscribed_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          created_at: string
          form_type: string
          id: string
          identifier: string
        }
        Insert: {
          created_at?: string
          form_type: string
          id?: string
          identifier: string
        }
        Update: {
          created_at?: string
          form_type?: string
          id?: string
          identifier?: string
        }
        Relationships: []
      }
      recognized_donors: {
        Row: {
          created_at: string
          display_order: number | null
          id: string
          is_partner: boolean | null
          is_visible: boolean | null
          logo_url: string | null
          name: string
          tier: Database["public"]["Enums"]["donor_tier"]
          updated_at: string
          website_url: string | null
        }
        Insert: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_partner?: boolean | null
          is_visible?: boolean | null
          logo_url?: string | null
          name: string
          tier?: Database["public"]["Enums"]["donor_tier"]
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          created_at?: string
          display_order?: number | null
          id?: string
          is_partner?: boolean | null
          is_visible?: boolean | null
          logo_url?: string | null
          name?: string
          tier?: Database["public"]["Enums"]["donor_tier"]
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          created_at: string
          id: string
          respondent_email: string | null
          respondent_name: string | null
          responses: Json
          survey_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          respondent_email?: string | null
          respondent_name?: string | null
          responses?: Json
          survey_type: string
        }
        Update: {
          created_at?: string
          id?: string
          respondent_email?: string | null
          respondent_name?: string | null
          responses?: Json
          survey_type?: string
        }
        Relationships: []
      }
      training_documents: {
        Row: {
          category: string
          created_at: string
          description: string | null
          file_size_bytes: number | null
          file_type: string | null
          file_url: string
          id: string
          is_published: boolean | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          file_size_bytes?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          is_published?: boolean | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          file_size_bytes?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_published?: boolean | null
          title?: string
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_form_type: string
          p_identifier: string
          p_max_requests?: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      try_assign_first_admin: { Args: { p_user_id: string }; Returns: Json }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      contact_segment:
        | "donor"
        | "member"
        | "partner"
        | "volunteer"
        | "subscriber"
        | "other"
      donor_tier: "platinum" | "gold" | "silver" | "bronze" | "supporter"
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
      app_role: ["admin", "moderator", "user"],
      contact_segment: [
        "donor",
        "member",
        "partner",
        "volunteer",
        "subscriber",
        "other",
      ],
      donor_tier: ["platinum", "gold", "silver", "bronze", "supporter"],
    },
  },
} as const
