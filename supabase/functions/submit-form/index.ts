import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface RateLimitConfig {
  maxRequests: number;
  windowMinutes: number;
}

const RATE_LIMITS: Record<string, RateLimitConfig> = {
  contact: { maxRequests: 3, windowMinutes: 60 },
  newsletter: { maxRequests: 2, windowMinutes: 60 },
  membership: { maxRequests: 2, windowMinutes: 60 },
  survey: { maxRequests: 5, windowMinutes: 60 },
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { formType, data, identifier } = await req.json();

    if (!formType || !data || !identifier) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: formType, data, identifier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const rateLimit = RATE_LIMITS[formType];
    if (!rateLimit) {
      return new Response(
        JSON.stringify({ error: 'Invalid form type' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    const { data: isAllowed, error: rateLimitError } = await supabase.rpc(
      'check_rate_limit',
      {
        p_identifier: identifier,
        p_form_type: formType,
        p_max_requests: rateLimit.maxRequests,
        p_window_minutes: rateLimit.windowMinutes,
      }
    );

    if (rateLimitError) {
      console.error('Rate limit check error:', rateLimitError);
      return new Response(
        JSON.stringify({ error: 'Failed to check rate limit' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!isAllowed) {
      return new Response(
        JSON.stringify({ 
          error: 'rate_limited',
          message: `Too many submissions. Please wait ${rateLimit.windowMinutes} minutes before trying again.`
        }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the rate limit entry
    await supabase.from('rate_limits').insert({
      identifier,
      form_type: formType,
    });

    // Clean up old rate limit entries occasionally (1% chance)
    if (Math.random() < 0.01) {
      await supabase.rpc('cleanup_old_rate_limits');
    }

    // Insert the form data based on form type
    let insertError;
    
    switch (formType) {
      case 'contact':
        const { error: contactError } = await supabase
          .from('contact_submissions')
          .insert(data);
        insertError = contactError;
        break;
        
      case 'newsletter':
        const { error: newsletterError } = await supabase
          .from('newsletter_subscriptions')
          .insert(data);
        insertError = newsletterError;
        break;
        
      case 'membership':
        const { error: membershipError } = await supabase
          .from('membership_registrations')
          .insert(data);
        insertError = membershipError;
        break;
        
      case 'survey':
        const { error: surveyError } = await supabase
          .from('survey_responses')
          .insert(data);
        insertError = surveyError;
        break;
        
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown form type' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    if (insertError) {
      // Handle duplicate email for newsletter
      if (insertError.code === '23505' && formType === 'newsletter') {
        return new Response(
          JSON.stringify({ error: 'duplicate', message: 'Email already subscribed' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      console.error('Insert error:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to submit form' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});