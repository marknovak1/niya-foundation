import { supabase } from "@/integrations/supabase/client";

type FormType = 'contact' | 'newsletter' | 'membership' | 'survey';

interface SubmitResult {
  success: boolean;
  error?: string;
  isRateLimited?: boolean;
  isDuplicate?: boolean;
}

export async function submitFormWithRateLimit(
  formType: FormType,
  data: Record<string, unknown>,
  email: string
): Promise<SubmitResult> {
  try {
    const { data: responseData, error } = await supabase.functions.invoke('submit-form', {
      body: {
        formType,
        data,
        identifier: email,
      },
    });

    if (error) {
      // Check if it's a rate limit error (429)
      if (error.message?.includes('429') || error.message?.includes('rate_limited')) {
        return {
          success: false,
          error: 'Too many submissions. Please wait before trying again.',
          isRateLimited: true,
        };
      }
      
      throw error;
    }

    if (responseData?.error === 'rate_limited') {
      return {
        success: false,
        error: responseData.message || 'Too many submissions. Please wait before trying again.',
        isRateLimited: true,
      };
    }

    if (responseData?.error === 'duplicate') {
      return {
        success: false,
        error: responseData.message || 'Already submitted.',
        isDuplicate: true,
      };
    }

    if (responseData?.success) {
      return { success: true };
    }

    return {
      success: false,
      error: responseData?.error || 'Unknown error occurred',
    };
  } catch (error) {
    console.error('Form submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit form',
    };
  }
}