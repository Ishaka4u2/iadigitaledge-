import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Unauthorized');
    }

    const { network, phoneNumber, planName, planType, amount } = await req.json();

    console.log('Processing data purchase:', { network, phoneNumber, planName, planType, amount, userId: user.id });

    // Generate unique reference
    const reference = `DATA-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Check wallet balance and deduct
    const { data: walletData, error: walletError } = await supabaseClient
      .from('wallets')
      .select('balance')
      .eq('user_id', user.id)
      .single();

    if (walletError) throw new Error('Failed to fetch wallet balance');
    if (walletData.balance < amount) {
      throw new Error('Insufficient balance');
    }

    // Deduct from wallet
    const success = await supabaseClient.rpc('update_wallet_balance', {
      p_user_id: user.id,
      p_amount: amount,
      p_operation: 'deduct'
    });

    if (!success.data) {
      throw new Error('Failed to deduct from wallet');
    }

    // Create transaction record
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('transactions')
      .insert({
        user_id: user.id,
        type: 'data',
        status: 'processing',
        amount,
        phone_number: phoneNumber,
        network: network.toUpperCase(),
        plan_name: planName,
        plan_type: planType,
        reference,
        metadata: {
          request_time: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction creation error:', transactionError);
      // Refund wallet
      await supabaseClient.rpc('update_wallet_balance', {
        p_user_id: user.id,
        p_amount: amount,
        p_operation: 'add'
      });
      throw new Error('Failed to create transaction');
    }

    // TODO: Integrate with VTU provider API
    // For now, simulate successful processing
    const providerResponse = {
      success: true,
      reference: reference,
      message: 'Data purchase successful'
    };

    // Update transaction status
    const finalStatus = providerResponse.success ? 'completed' : 'failed';
    await supabaseClient
      .from('transactions')
      .update({
        status: finalStatus,
        metadata: {
          ...transaction.metadata,
          provider_response: providerResponse,
          completed_time: new Date().toISOString()
        }
      })
      .eq('id', transaction.id);

    // If failed, refund wallet
    if (!providerResponse.success) {
      await supabaseClient.rpc('update_wallet_balance', {
        p_user_id: user.id,
        p_amount: amount,
        p_operation: 'add'
      });
    }

    // Send webhook notification if configured
    const { data: webhooks } = await supabaseClient
      .from('webhooks')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .contains('events', ['transaction.completed']);

    if (webhooks && webhooks.length > 0) {
      for (const webhook of webhooks) {
        fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Secret': webhook.secret,
          },
          body: JSON.stringify({
            event: 'transaction.completed',
            data: { ...transaction, status: finalStatus }
          }),
        }).catch(err => console.error('Webhook error:', err));
      }
    }

    console.log('Data purchase completed:', { reference, status: finalStatus });

    return new Response(
      JSON.stringify({
        success: true,
        transaction,
        reference,
        status: finalStatus,
        message: providerResponse.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in process-data:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});