import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Flag to indicate whether we're in development mode without env variables
const isMockMode = !supabaseUrl || !supabaseKey;

// Create a conditional Supabase client
let supabase: SupabaseClient;

// Check if we're in development mode without env variables
if (isMockMode) {
  console.warn(
    "Supabase credentials missing! Using mock client in development mode"
  );

  // Create a mock client for development with a structure similar to the real client
  const mockResponse = <T>(data: T) => Promise.resolve({ data, error: null });

  // Mock implementation that mirrors the PostgrestFilterBuilder chain methods
  const createMockBuilder = () => {
    const builder: any = {
      select: () => builder,
      insert: (data: any) =>
        mockResponse([
          { id: "mock-id", created_at: new Date().toISOString(), ...data[0] },
        ]),
      update: () =>
        mockResponse([{ id: "mock-id", created_at: new Date().toISOString() }]),
      delete: () => mockResponse(true),
      eq: () => builder,
      single: () =>
        mockResponse({ id: "mock-id", created_at: new Date().toISOString() }),
      order: () => builder,
      limit: () => builder,
      count: () => mockResponse({ count: 5 }),
    };
    return builder;
  };

  // Create a minimal mock client that won't throw runtime errors
  supabase = {
    from: () => createMockBuilder(),
    auth: {
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    },
  } as unknown as SupabaseClient;
} else {
  // Create the actual Supabase client when credentials are available
  supabase = createClient(supabaseUrl, supabaseKey);
}

export { supabase, isMockMode };

// Types for your database tables
export type Quote = {
  id: string;
  created_at: string;
  guest_name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  nights: number;
  adults: number;
  children: number;
  room_type: string;
  price_per_night: number;
  additional_fees: number;
  notes: string;
  booking_id: string;
  children_details: string;
  special_requests: string;
  additional_services: string;
  user_id?: string;
};

// Helper functions for database operations
export async function saveQuote(quote: Omit<Quote, "id" | "created_at">) {
  try {
    console.log("Save quote called with:", quote);

    const { data, error } = await supabase
      .from("quotes")
      .insert([quote])
      .select();

    if (error) {
      console.error("Error saving quote:", error);
      throw error;
    }

    if (isMockMode) {
      console.log("Mock mode active - simulating successful save");
      return { id: "mock-id", created_at: new Date().toISOString(), ...quote };
    }

    return data?.[0];
  } catch (err) {
    console.error("Exception in saveQuote:", err);
    // In development, return mock data to allow testing without Supabase
    if (process.env.NODE_ENV === "development") {
      console.log("Returning mock data in development mode");
      return { id: "mock-id", created_at: new Date().toISOString(), ...quote };
    }
    throw err;
  }
}

export async function getQuotes(userId?: string) {
  try {
    let query = supabase
      .from("quotes")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching quotes:", error);
      throw error;
    }

    if (isMockMode) {
      // Return sample data in mock mode
      return Array(5)
        .fill(0)
        .map((_, i) => ({
          id: `mock-id-${i}`,
          created_at: new Date().toISOString(),
          guest_name: `Guest ${i}`,
          email: `guest${i}@example.com`,
          phone: "1234567890",
          check_in: new Date().toISOString(),
          check_out: new Date(Date.now() + 3 * 86400000).toISOString(),
          nights: 3,
          adults: 2,
          children: 1,
          room_type: "Deluxe Room",
          price_per_night: 2000000,
          additional_fees: 200000,
          notes: "Sample note",
          booking_id: `BKK-00${i}`,
          children_details: "1 child (5 years old)",
          special_requests: "Early check-in",
          additional_services: "Airport transfer",
        }));
    }

    return data;
  } catch (err) {
    console.error("Exception in getQuotes:", err);
    if (process.env.NODE_ENV === "development") {
      // Return mock data in development mode
      return Array(5)
        .fill(0)
        .map((_, i) => ({
          id: `mock-id-${i}`,
          created_at: new Date().toISOString(),
          guest_name: `Guest ${i}`,
          email: `guest${i}@example.com`,
          phone: "1234567890",
          check_in: new Date().toISOString(),
          check_out: new Date(Date.now() + 3 * 86400000).toISOString(),
          nights: 3,
          adults: 2,
          children: 1,
          room_type: "Deluxe Room",
          price_per_night: 2000000,
          additional_fees: 200000,
          notes: "Sample note",
          booking_id: `BKK-00${i}`,
          children_details: "1 child (5 years old)",
          special_requests: "Early check-in",
          additional_services: "Airport transfer",
        }));
    }
    throw err;
  }
}

export async function getQuoteById(id: string) {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching quote:", error);
      throw error;
    }

    return data;
  } catch (err) {
    console.error("Exception in getQuoteById:", err);
    if (process.env.NODE_ENV === "development" || isMockMode) {
      // Return mock data in development mode
      return {
        id: id,
        created_at: new Date().toISOString(),
        guest_name: "Mock Guest",
        email: "mock@example.com",
        phone: "1234567890",
        check_in: new Date().toISOString(),
        check_out: new Date(Date.now() + 3 * 86400000).toISOString(),
        nights: 3,
        adults: 2,
        children: 1,
        room_type: "Deluxe Room",
        price_per_night: 2000000,
        additional_fees: 200000,
        notes: "Sample note",
        booking_id: "BKK-001",
        children_details: "1 child (5 years old)",
        special_requests: "Early check-in",
        additional_services: "Airport transfer",
      };
    }
    throw err;
  }
}

export async function updateQuote(id: string, quote: Partial<Quote>) {
  const { data, error } = await supabase
    .from("quotes")
    .update(quote)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating quote:", error);
    throw error;
  }

  return data?.[0];
}

export async function deleteQuote(id: string) {
  const { error } = await supabase.from("quotes").delete().eq("id", id);

  if (error) {
    console.error("Error deleting quote:", error);
    throw error;
  }

  return true;
}
