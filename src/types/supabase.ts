/**
 * Supabase Database type (scaffold)
 * Regenerate with: npx supabase gen types typescript --local > src/types/supabase.ts
 * @see docs/REFERENCE.md section 1
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "consumer" | "business" | "admin";
export type ConsumerTier = "all" | "premium" | "value" | "budget";
export type IndustryType =
  | "dining"
  | "tours"
  | "realestate"
  | "yacht"
  | "cars"
  | "freelancer"
  | "retail"
  | "beauty";
export type SubscriptionTier = "free" | "starter" | "pro" | "enterprise";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "escrow_held"
  | "completed"
  | "approved"
  | "disputed"
  | "cancelled"
  | "refunded";

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
          tier: ConsumerTier;
          language: string;
          dietary_filters: string[];
          accessibility_filters: string[];
          location_lat: number | null;
          location_lng: number | null;
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
          industry: IndustryType;
          description: string | null;
          address: string | null;
          locality: string;
          lat: number | null;
          lng: number | null;
          emoji: string | null;
          cover_image_url: string | null;
          gallery_urls: string[];
          price_tier: string | null;
          avg_price: string | null;
          currency_usd: string | null;
          pjazza_rating: number;
          pjazza_review_count: number;
          google_rating: number | null;
          google_review_count: number | null;
          tripadvisor_rating: number | null;
          tripadvisor_review_count: number | null;
          verified: boolean;
          verified_at: string | null;
          tags: string[];
          vibe: Json;
          crowd_pct: number;
          crowd_updated_at: string | null;
          halal_score: number | null;
          dietary_tags: string[];
          wheelchair_accessible: boolean;
          subscription: SubscriptionTier;
          stripe_account_id: string | null;
          is_live: boolean;
          live_viewer_count: number;
          stream_room_id: string | null;
          streaming_streak: number;
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
      services: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          description: string | null;
          price: number;
          price_unit: string;
          response_time_min: number | null;
          jobs_completed: number;
          portfolio_count: number;
          is_available: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["services"]["Row"], "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["services"]["Insert"]>;
      };
      bookings: {
        Row: {
          id: string;
          consumer_id: string | null;
          business_id: string | null;
          booking_type: string;
          date: string | null;
          time: string | null;
          guests: number | null;
          notes: string | null;
          product_id: string | null;
          service_id: string | null;
          amount: number;
          commission_rate: number | null;
          commission_amount: number | null;
          net_business_amount: number | null;
          currency: string;
          stripe_payment_intent_id: string | null;
          stripe_transfer_id: string | null;
          status: BookingStatus;
          seller_photo_url: string | null;
          buyer_approved: boolean | null;
          buyer_approved_at: string | null;
          before_photo_url: string | null;
          after_photo_url: string | null;
          delivery_method: string | null;
          delivery_fee: number;
          delivery_address: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string | null;
          consumer_id: string | null;
          business_id: string | null;
          rating: number;
          text: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "created_at"> & {
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      streams: {
        Row: {
          id: string;
          business_id: string | null;
          room_id: string;
          started_at: string;
          ended_at: string | null;
          peak_viewers: number;
          total_viewers: number;
          replay_url: string | null;
          preset: string | null;
          duration_seconds: number | null;
          is_live: boolean;
        };
        Insert: Omit<Database["public"]["Tables"]["streams"]["Row"], "started_at"> & {
          started_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["streams"]["Insert"]>;
      };
    };
    Enums: {
      user_role: UserRole;
      consumer_tier: ConsumerTier;
      industry_type: IndustryType;
      subscription_tier: SubscriptionTier;
      booking_status: BookingStatus;
    };
  };
}
