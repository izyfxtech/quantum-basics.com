export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15";
  };
  public: {
    Tables: {
      assignments: {
        Row: {
          course_id: string;
          created_at: string;
          created_by: string | null;
          description: string;
          due_at: string | null;
          id: string;
          instructions: string | null;
          max_score: number;
          published: boolean;
          title: string;
          updated_at: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          due_at?: string | null;
          id?: string;
          instructions?: string | null;
          max_score?: number;
          published?: boolean;
          title: string;
          updated_at?: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          due_at?: string | null;
          id?: string;
          instructions?: string | null;
          max_score?: number;
          published?: boolean;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "assignments_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_editors: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["blog_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["blog_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["blog_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_editors_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      blog_posts: {
        Row: {
          byline: string;
          category: string;
          created_at: string;
          created_by: string | null;
          hero_alt: string | null;
          hero_image_path: string | null;
          id: string;
          published: boolean;
          published_at: string | null;
          read_minutes: number;
          sections: Json;
          slug: string;
          summary: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          byline?: string;
          category: string;
          created_at?: string;
          created_by?: string | null;
          hero_alt?: string | null;
          hero_image_path?: string | null;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          read_minutes?: number;
          sections?: Json;
          slug: string;
          summary: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          byline?: string;
          category?: string;
          created_at?: string;
          created_by?: string | null;
          hero_alt?: string | null;
          hero_image_path?: string | null;
          id?: string;
          published?: boolean;
          published_at?: string | null;
          read_minutes?: number;
          sections?: Json;
          slug?: string;
          summary?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "blog_posts_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      course_events: {
        Row: {
          course_id: string | null;
          created_at: string;
          created_by: string | null;
          description: string | null;
          event_date: string;
          id: string;
          title: string;
        };
        Insert: {
          course_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          event_date: string;
          id?: string;
          title: string;
        };
        Update: {
          course_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          description?: string | null;
          event_date?: string;
          id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_events_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_events_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      course_staff: {
        Row: {
          course_id: string;
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_staff_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_staff_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      courses: {
        Row: {
          created_at: string;
          created_by: string | null;
          duration: string;
          id: string;
          level: string;
          slug: string;
          sort_order: number;
          summary: string;
          title: string;
          track: string;
        };
        Insert: {
          created_at?: string;
          created_by?: string | null;
          duration?: string;
          id?: string;
          level?: string;
          slug: string;
          sort_order?: number;
          summary: string;
          title: string;
          track: string;
        };
        Update: {
          created_at?: string;
          created_by?: string | null;
          duration?: string;
          id?: string;
          level?: string;
          slug?: string;
          sort_order?: number;
          summary?: string;
          title?: string;
          track?: string;
        };
        Relationships: [
          {
            foreignKeyName: "courses_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      enrollments: {
        Row: {
          course_id: string;
          created_at: string;
          id: string;
          user_id: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          id?: string;
          user_id: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "enrollments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lesson_progress: {
        Row: {
          completed_at: string;
          id: string;
          lesson_id: string;
          user_id: string;
        };
        Insert: {
          completed_at?: string;
          id?: string;
          lesson_id: string;
          user_id: string;
        };
        Update: {
          completed_at?: string;
          id?: string;
          lesson_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey";
            columns: ["lesson_id"];
            isOneToOne: false;
            referencedRelation: "lessons";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      lessons: {
        Row: {
          body: string;
          course_id: string;
          created_at: string;
          id: string;
          minutes: number;
          sort_order: number;
          title: string;
        };
        Insert: {
          body: string;
          course_id: string;
          created_at?: string;
          id?: string;
          minutes?: number;
          sort_order?: number;
          title: string;
        };
        Update: {
          body?: string;
          course_id?: string;
          created_at?: string;
          id?: string;
          minutes?: number;
          sort_order?: number;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
        ];
      };
      materials: {
        Row: {
          content_type: string | null;
          course_id: string;
          created_at: string;
          description: string | null;
          id: string;
          size_bytes: number | null;
          storage_path: string;
          title: string;
          uploaded_by: string | null;
        };
        Insert: {
          content_type?: string | null;
          course_id: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          size_bytes?: number | null;
          storage_path: string;
          title: string;
          uploaded_by?: string | null;
        };
        Update: {
          content_type?: string | null;
          course_id?: string;
          created_at?: string;
          description?: string | null;
          id?: string;
          size_bytes?: number | null;
          storage_path?: string;
          title?: string;
          uploaded_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "materials_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "materials_uploaded_by_fkey";
            columns: ["uploaded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      notices: {
        Row: {
          body: string;
          course_id: string | null;
          created_at: string;
          created_by: string | null;
          id: string;
          title: string;
        };
        Insert: {
          body: string;
          course_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          title: string;
        };
        Update: {
          body?: string;
          course_id?: string | null;
          created_at?: string;
          created_by?: string | null;
          id?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notices_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "notices_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          email: string | null;
          full_name: string | null;
          id: string;
          onboarding_completed_at: string | null;
          organisation: string | null;
          phone: string | null;
          preferred_track: string | null;
          staff_eligible: boolean;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id: string;
          onboarding_completed_at?: string | null;
          organisation?: string | null;
          phone?: string | null;
          preferred_track?: string | null;
          staff_eligible?: boolean;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          email?: string | null;
          full_name?: string | null;
          id?: string;
          onboarding_completed_at?: string | null;
          organisation?: string | null;
          phone?: string | null;
          preferred_track?: string | null;
          staff_eligible?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      quiz_attempts: {
        Row: {
          answers: Json;
          attempt_number: number;
          created_at: string;
          feedback: string | null;
          id: string;
          max_score: number | null;
          quiz_id: string;
          score: number | null;
          started_at: string;
          submitted_at: string | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          answers?: Json;
          attempt_number?: number;
          created_at?: string;
          feedback?: string | null;
          id?: string;
          max_score?: number | null;
          quiz_id: string;
          score?: number | null;
          started_at?: string;
          submitted_at?: string | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          answers?: Json;
          attempt_number?: number;
          created_at?: string;
          feedback?: string | null;
          id?: string;
          max_score?: number | null;
          quiz_id?: string;
          score?: number | null;
          started_at?: string;
          submitted_at?: string | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      quiz_questions: {
        Row: {
          correct_answer: Json;
          created_at: string;
          id: string;
          options: Json;
          points: number;
          prompt: string;
          question_type: string;
          quiz_id: string;
          sort_order: number;
        };
        Insert: {
          correct_answer?: Json;
          created_at?: string;
          id?: string;
          options?: Json;
          points?: number;
          prompt: string;
          question_type?: string;
          quiz_id: string;
          sort_order?: number;
        };
        Update: {
          correct_answer?: Json;
          created_at?: string;
          id?: string;
          options?: Json;
          points?: number;
          prompt?: string;
          question_type?: string;
          quiz_id?: string;
          sort_order?: number;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["id"];
          },
        ];
      };
      quizzes: {
        Row: {
          course_id: string;
          created_at: string;
          created_by: string | null;
          description: string;
          due_at: string | null;
          id: string;
          max_attempts: number | null;
          published: boolean;
          shuffle_questions: boolean;
          time_limit_minutes: number | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          due_at?: string | null;
          id?: string;
          max_attempts?: number | null;
          published?: boolean;
          shuffle_questions?: boolean;
          time_limit_minutes?: number | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          created_by?: string | null;
          description?: string;
          due_at?: string | null;
          id?: string;
          max_attempts?: number | null;
          published?: boolean;
          shuffle_questions?: boolean;
          time_limit_minutes?: number | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quizzes_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      submissions: {
        Row: {
          assignment_id: string;
          content: string | null;
          created_at: string;
          feedback: string | null;
          file_path: string | null;
          graded_at: string | null;
          graded_by: string | null;
          id: string;
          score: number | null;
          submitted_at: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          assignment_id: string;
          content?: string | null;
          created_at?: string;
          feedback?: string | null;
          file_path?: string | null;
          graded_at?: string | null;
          graded_by?: string | null;
          id?: string;
          score?: number | null;
          submitted_at?: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          assignment_id?: string;
          content?: string | null;
          created_at?: string;
          feedback?: string | null;
          file_path?: string | null;
          graded_at?: string | null;
          graded_by?: string | null;
          id?: string;
          score?: number | null;
          submitted_at?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "submissions_assignment_id_fkey";
            columns: ["assignment_id"];
            isOneToOne: false;
            referencedRelation: "assignments";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "submissions_graded_by_fkey";
            columns: ["graded_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "submissions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_roles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      add_blog_team_member: {
        Args: { _email: string; _role: Database["public"]["Enums"]["blog_role"] };
        Returns: {
          email: string;
          full_name: string;
          id: string;
          role: Database["public"]["Enums"]["blog_role"];
          user_id: string;
        }[];
      };
      blog_team: {
        Args: Record<PropertyKey, never>;
        Returns: {
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          role: Database["public"]["Enums"]["blog_role"];
          user_id: string;
        }[];
      };
      course_lesson_previews: {
        Args: { _course_id: string };
        Returns: {
          id: string;
          minutes: number;
          sort_order: number;
          title: string;
        }[];
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_course_instructor: {
        Args: { _course_id: string; _user_id: string };
        Returns: boolean;
      };
      is_course_staff: {
        Args: {
          _course_id: string;
          _roles?: Database["public"]["Enums"]["app_role"][];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_super_admin: {
        Args: { _user_id: string };
        Returns: boolean;
      };
      is_blog_team: {
        Args: { _user_id: string };
        Returns: boolean;
      };
      is_blog_editor_role: {
        Args: { _user_id: string };
        Returns: boolean;
      };
      quiz_questions_for_attempt: {
        Args: { _quiz_id: string };
        Returns: {
          id: string;
          options: Json;
          points: number;
          prompt: string;
          question_type: string;
          quiz_id: string;
          sort_order: number;
        }[];
      };
    };
    Enums: {
      app_role: "super_admin" | "instructor" | "teaching_assistant" | "student" | "auditor";
      blog_role: "editor" | "author";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "instructor", "teaching_assistant", "student", "auditor"],
      blog_role: ["editor", "author"],
    },
  },
} as const;
