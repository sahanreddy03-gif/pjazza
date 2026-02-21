/**
 * Supabase types matching 001_initial_schema.sql
 * Regenerate with: npx supabase gen types typescript --local > src/types/supabase.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "consumer" | "business" | "admin";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      businesses: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          slug: string;
          industry: string;
          description: string | null;
          address: string | null;
          locality: string;
          verified: boolean;
          stripe_account_id: string | null;
          is_live: boolean;
          live_viewer_count: number;
          stream_room_id: string | null;
          cover_image_url: string | null;
          logo_url: string | null;
          image_urls: string[] | null;
          google_review_count: number | null;
          google_rating: number | null;
          tripadvisor_review_count: number | null;
          tripadvisor_rating: number | null;
          address_full: string | null;
          phone: string | null;
          website_url: string | null;
          opening_hours: string | null;
          vibe_summary: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["businesses"]["Row"], "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["businesses"]["Insert"]>;
      };
      products: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          description: string | null;
          price: number;
          image_urls: string[];
          is_available: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["products"]["Row"], "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
      streams: {
        Row: {
          id: string;
          business_id: string | null;
          room_id: string | null;
          preset: string | null;
          title: string | null;
          description: string | null;
          video_url: string | null;
          thumbnail_url: string | null;
          started_at: string;
          ended_at: string | null;
          peak_viewers: number;
          is_live: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["streams"]["Row"], "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["streams"]["Insert"]>;
      };
      business_reviews: {
        Row: {
          id: string;
          business_id: string;
          platform: string;
          rating: number;
          review_text: string;
          author_name: string | null;
          is_positive: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["business_reviews"]["Row"], "created_at"> & { created_at?: string };
        Update: Partial<Database["public"]["Tables"]["business_reviews"]["Insert"]>;
      };
      bookings: {
        Row: {
          id: string;
          consumer_id: string | null;
          business_id: string | null;
          amount: number;
          currency: string;
          status: string;
          stripe_payment_intent_id: string | null;
          items: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
    };
  };
}

export type BusinessRow = Database["public"]["Tables"]["businesses"]["Row"];
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type StreamRow = Database["public"]["Tables"]["streams"]["Row"];
