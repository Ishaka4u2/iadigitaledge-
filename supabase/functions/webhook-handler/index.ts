import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get webhook signature from header
    const signature = req.headers.get('x-webhook-signature');
    const body = await req.text();
    const payload = JSON.parse(body);

    console.log('Received webhook:', { event: payload.event, reference: payload.reference });

    // Verify webhook signature (if using external VTU provider)
    // TODO: Implement signature verification with your VTU provider's secret
    
    // Process webhook based on event type
    if (payload.event === 'transaction.update') {
      const { reference, status, message } = payload;

      // Find transaction by reference
      const { data: transaction, error } = await supabaseClient
        .from('transactions')
        .select('*')
        .eq('reference', reference)
        .single();

      if (error || !transaction) {
        console.error('Transaction not found:', reference);
        throw new Error('Transaction not found');
      }

      // Update transaction status
      await supabaseClient
        .from('transactions')
        .update({
          status,
          metadata: {
            ...transaction.metadata,
            webhook_update: {
              message,
              timestamp: new Date().toISOString(),
              raw_payload: payload
            }
          }
        })
        .eq('id', transaction.id);

      // If transaction failed, refund wallet
      if (status === 'failed') {
        await supabaseClient.rpc('update_wallet_balance', {
          p_user_id: transaction.user_id,
          p_amount: transaction.amount,
          p_operation: 'add'
        });
        console.log('Wallet refunded for failed transaction:', reference);
      }

      // Send notification to user's configured webhooks
      const { data: webhooks } = await supabaseClient
        .from('webhooks')
        .select('*')
        .eq('user_id', transaction.user_id)
        .eq('is_active', true)
        .contains('events', ['transaction.updated']);

      if (webhooks && webhooks.length > 0) {
        for (const webhook of webhooks) {
          fetch(webhook.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Secret': webhook.secret,
            },
            body: JSON.stringify({
              event: 'transaction.updated',
              data: { ...transaction, status }
            }),
          }).catch(err => console.error('User webhook error:', err));
        }
      }

      console.log('Transaction updated:', { reference, status });
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in webhook-handler:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});