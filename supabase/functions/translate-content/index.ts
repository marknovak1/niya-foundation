import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface TranslationRequest {
  title: string;
  excerpt: string;
  content?: string;
  sourceLanguage?: string;
}

interface TranslationResult {
  fr: { title: string; excerpt: string; content: string | null };
  es: { title: string; excerpt: string; content: string | null };
  ar: { title: string; excerpt: string; content: string | null };
  ru: { title: string; excerpt: string; content: string | null };
  zh: { title: string; excerpt: string; content: string | null };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication - only admins and moderators can translate
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabaseAuth.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = claimsData.claims.sub;

    // Check if user is admin or moderator using service role
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data: roles, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (rolesError) {
      console.error("Error checking user roles:", rolesError);
      return new Response(
        JSON.stringify({ error: "Failed to verify user permissions" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isAdmin = roles?.some((r) => r.role === "admin");
    const isModerator = roles?.some((r) => r.role === "moderator");

    if (!isAdmin && !isModerator) {
      return new Response(
        JSON.stringify({ error: "Only admins and moderators can translate content" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { title, excerpt, content, sourceLanguage = "en" } = await req.json() as TranslationRequest;
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const targetLanguages = [
      { code: "fr", name: "French" },
      { code: "es", name: "Spanish" },
      { code: "ar", name: "Arabic" },
      { code: "ru", name: "Russian" },
      { code: "zh", name: "Chinese (Simplified)" },
    ];

    const translations: TranslationResult = {
      fr: { title: "", excerpt: "", content: null },
      es: { title: "", excerpt: "", content: null },
      ar: { title: "", excerpt: "", content: null },
      ru: { title: "", excerpt: "", content: null },
      zh: { title: "", excerpt: "", content: null },
    };

    // Translate to all languages in parallel
    const translationPromises = targetLanguages.map(async (lang) => {
      const prompt = `Translate the following content from ${sourceLanguage} to ${lang.name}. 
Return ONLY a valid JSON object with these exact keys: "title", "excerpt", "content".
Do not include any explanation or markdown formatting, just the JSON.

Content to translate:
Title: ${title}
Excerpt: ${excerpt}
${content ? `Content (HTML): ${content}` : "Content: (none)"}`;

      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { 
              role: "system", 
              content: "You are a professional translator. Return only valid JSON with translated content. Preserve any HTML formatting in the content field. If content is empty or '(none)', set content to null in the JSON." 
            },
            { role: "user", content: prompt },
          ],
        }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        }
        if (response.status === 402) {
          throw new Error("Payment required. Please add credits to your workspace.");
        }
        const errorText = await response.text();
        console.error(`Translation error for ${lang.code}:`, errorText);
        throw new Error(`Translation failed for ${lang.name}`);
      }

      const data = await response.json();
      const translatedText = data.choices?.[0]?.message?.content || "";
      
      // Parse the JSON response
      try {
        // Clean up potential markdown code blocks
        let cleanJson = translatedText.trim();
        if (cleanJson.startsWith("```json")) {
          cleanJson = cleanJson.slice(7);
        }
        if (cleanJson.startsWith("```")) {
          cleanJson = cleanJson.slice(3);
        }
        if (cleanJson.endsWith("```")) {
          cleanJson = cleanJson.slice(0, -3);
        }
        cleanJson = cleanJson.trim();
        
        const parsed = JSON.parse(cleanJson);
        return {
          code: lang.code,
          title: parsed.title || title,
          excerpt: parsed.excerpt || excerpt,
          content: parsed.content || null,
        };
      } catch (parseError) {
        console.error(`Failed to parse translation for ${lang.code}:`, translatedText);
        return {
          code: lang.code,
          title: title,
          excerpt: excerpt,
          content: content || null,
        };
      }
    });

    const results = await Promise.all(translationPromises);
    
    for (const result of results) {
      const langCode = result.code as keyof TranslationResult;
      translations[langCode] = {
        title: result.title,
        excerpt: result.excerpt,
        content: result.content,
      };
    }

    return new Response(JSON.stringify({ translations }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Translation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
