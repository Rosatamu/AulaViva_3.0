import { supabase } from '../lib/supabase';

export interface CriptoAulaWallet {
  id: string;
  student_id: string;
  balance_aula_coins: number;
  balance_cripto_aula: number;
  total_earned_aula_coins: number;
  total_earned_cripto_aula: number;
  total_spent_aula_coins: number;
  total_spent_cripto_aula: number;
  wallet_level: 'Bronce' | 'Plata' | 'Oro' | 'Platino';
  created_at: string;
  updated_at: string;
}

export interface CriptoAulaTransaction {
  id?: string;
  student_id: string;
  transaction_type:
    | 'earn_activity'
    | 'earn_quiz'
    | 'earn_marketplace_sale'
    | 'earn_bonus'
    | 'earn_streak'
    | 'earn_referral'
    | 'spend_listing_fee'
    | 'spend_purchase'
    | 'spend_premium'
    | 'spend_reward'
    | 'conversion_to_cripto'
    | 'conversion_to_aula';
  currency: 'AulaCoins' | 'CriptoAula';
  amount: number;
  balance_after: number;
  description?: string;
  reference_id?: string;
  metadata?: any;
  created_at?: string;
}

export interface ConversionRate {
  id: string;
  from_currency: 'AulaCoins' | 'CriptoAula';
  to_currency: 'AulaCoins' | 'CriptoAula';
  rate: number;
  is_active: boolean;
  effective_from: string;
}

export interface MarketplacePayment {
  id?: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  payment_currency: 'AulaCoins' | 'CriptoAula' | 'Mixed';
  amount_aula_coins: number;
  amount_cripto_aula: number;
  listing_fee_paid: number;
  fee_currency: 'AulaCoins' | 'CriptoAula';
  transaction_status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_metadata?: any;
  created_at?: string;
}

export class CriptoAulaService {
  static async getOrCreateWallet(studentId: string): Promise<CriptoAulaWallet> {
    try {
      const { data: existing, error: fetchError } = await supabase
        .from('cripto_aula_wallets')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching wallet:', fetchError);
        throw new Error('Error al obtener wallet');
      }

      if (existing) {
        return existing as CriptoAulaWallet;
      }

      const { data: newWallet, error: insertError } = await supabase
        .from('cripto_aula_wallets')
        .insert({
          student_id: studentId,
          balance_aula_coins: 0,
          balance_cripto_aula: 0,
          wallet_level: 'Bronce'
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating wallet:', insertError);
        throw new Error('Error al crear wallet');
      }

      return newWallet as CriptoAulaWallet;
    } catch (error) {
      console.error('Error in getOrCreateWallet:', error);
      throw error;
    }
  }

  static async syncWalletWithUserProgress(studentId: string): Promise<void> {
    try {
      const { data: userProgress } = await supabase
        .from('user_progress')
        .select('aula_coins, total_points')
        .eq('student_id', studentId)
        .maybeSingle();

      if (userProgress) {
        const wallet = await this.getOrCreateWallet(studentId);

        if (wallet.balance_aula_coins !== userProgress.aula_coins) {
          await supabase
            .from('cripto_aula_wallets')
            .update({
              balance_aula_coins: userProgress.aula_coins
            })
            .eq('student_id', studentId);
        }
      }
    } catch (error) {
      console.error('Error syncing wallet:', error);
    }
  }

  static async getActiveConversionRate(
    fromCurrency: 'AulaCoins' | 'CriptoAula',
    toCurrency: 'AulaCoins' | 'CriptoAula'
  ): Promise<number> {
    try {
      const { data, error } = await supabase
        .from('conversion_rates')
        .select('rate')
        .eq('from_currency', fromCurrency)
        .eq('to_currency', toCurrency)
        .eq('is_active', true)
        .order('effective_from', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error || !data) {
        return fromCurrency === 'AulaCoins' ? 0.1 : 10;
      }

      return Number(data.rate);
    } catch (error) {
      console.error('Error fetching conversion rate:', error);
      return fromCurrency === 'AulaCoins' ? 0.1 : 10;
    }
  }

  static async convertCurrency(
    studentId: string,
    fromCurrency: 'AulaCoins' | 'CriptoAula',
    amount: number
  ): Promise<CriptoAulaWallet> {
    try {
      const wallet = await this.getOrCreateWallet(studentId);
      const toCurrency = fromCurrency === 'AulaCoins' ? 'CriptoAula' : 'AulaCoins';
      const rate = await this.getActiveConversionRate(fromCurrency, toCurrency);

      const fromBalance =
        fromCurrency === 'AulaCoins'
          ? wallet.balance_aula_coins
          : wallet.balance_cripto_aula;

      if (fromBalance < amount) {
        throw new Error('Saldo insuficiente para conversión');
      }

      const convertedAmount = amount * rate;

      const updates: any = {};
      if (fromCurrency === 'AulaCoins') {
        updates.balance_aula_coins = wallet.balance_aula_coins - amount;
        updates.balance_cripto_aula = Number(wallet.balance_cripto_aula) + convertedAmount;
      } else {
        updates.balance_cripto_aula = Number(wallet.balance_cripto_aula) - amount;
        updates.balance_aula_coins = wallet.balance_aula_coins + Math.floor(convertedAmount);
      }

      const { data: updatedWallet, error: updateError } = await supabase
        .from('cripto_aula_wallets')
        .update(updates)
        .eq('student_id', studentId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating wallet:', updateError);
        throw new Error('Error al actualizar wallet');
      }

      await this.recordTransaction({
        student_id: studentId,
        transaction_type:
          fromCurrency === 'AulaCoins' ? 'conversion_to_cripto' : 'conversion_to_aula',
        currency: toCurrency,
        amount: convertedAmount,
        balance_after:
          toCurrency === 'AulaCoins'
            ? updatedWallet.balance_aula_coins
            : updatedWallet.balance_cripto_aula,
        description: `Conversión de ${amount} ${fromCurrency} a ${convertedAmount.toFixed(2)} ${toCurrency}`,
        metadata: { original_amount: amount, original_currency: fromCurrency, rate }
      });

      return updatedWallet as CriptoAulaWallet;
    } catch (error) {
      console.error('Error in convertCurrency:', error);
      throw error;
    }
  }

  static async earnCurrency(
    studentId: string,
    currency: 'AulaCoins' | 'CriptoAula',
    amount: number,
    transactionType: CriptoAulaTransaction['transaction_type'],
    description?: string,
    referenceId?: string
  ): Promise<CriptoAulaWallet> {
    try {
      const wallet = await this.getOrCreateWallet(studentId);

      const updates: any = {};
      if (currency === 'AulaCoins') {
        updates.balance_aula_coins = wallet.balance_aula_coins + Math.floor(amount);
        updates.total_earned_aula_coins = wallet.total_earned_aula_coins + Math.floor(amount);
      } else {
        updates.balance_cripto_aula = Number(wallet.balance_cripto_aula) + amount;
        updates.total_earned_cripto_aula = Number(wallet.total_earned_cripto_aula) + amount;
      }

      updates.wallet_level = this.calculateWalletLevel(
        updates.total_earned_aula_coins || wallet.total_earned_aula_coins,
        updates.total_earned_cripto_aula || wallet.total_earned_cripto_aula
      );

      const { data: updatedWallet, error: updateError } = await supabase
        .from('cripto_aula_wallets')
        .update(updates)
        .eq('student_id', studentId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating wallet:', updateError);
        throw new Error('Error al actualizar wallet');
      }

      await this.recordTransaction({
        student_id: studentId,
        transaction_type: transactionType,
        currency,
        amount,
        balance_after:
          currency === 'AulaCoins'
            ? updatedWallet.balance_aula_coins
            : updatedWallet.balance_cripto_aula,
        description,
        reference_id: referenceId
      });

      return updatedWallet as CriptoAulaWallet;
    } catch (error) {
      console.error('Error in earnCurrency:', error);
      throw error;
    }
  }

  static async spendCurrency(
    studentId: string,
    currency: 'AulaCoins' | 'CriptoAula',
    amount: number,
    transactionType: CriptoAulaTransaction['transaction_type'],
    description?: string,
    referenceId?: string
  ): Promise<CriptoAulaWallet> {
    try {
      const wallet = await this.getOrCreateWallet(studentId);

      const balance =
        currency === 'AulaCoins' ? wallet.balance_aula_coins : wallet.balance_cripto_aula;

      if (balance < amount) {
        throw new Error(`Saldo insuficiente de ${currency}`);
      }

      const updates: any = {};
      if (currency === 'AulaCoins') {
        updates.balance_aula_coins = wallet.balance_aula_coins - Math.floor(amount);
        updates.total_spent_aula_coins = wallet.total_spent_aula_coins + Math.floor(amount);
      } else {
        updates.balance_cripto_aula = Number(wallet.balance_cripto_aula) - amount;
        updates.total_spent_cripto_aula = Number(wallet.total_spent_cripto_aula) + amount;
      }

      const { data: updatedWallet, error: updateError } = await supabase
        .from('cripto_aula_wallets')
        .update(updates)
        .eq('student_id', studentId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating wallet:', updateError);
        throw new Error('Error al actualizar wallet');
      }

      await this.recordTransaction({
        student_id: studentId,
        transaction_type: transactionType,
        currency,
        amount: -amount,
        balance_after:
          currency === 'AulaCoins'
            ? updatedWallet.balance_aula_coins
            : updatedWallet.balance_cripto_aula,
        description,
        reference_id: referenceId
      });

      return updatedWallet as CriptoAulaWallet;
    } catch (error) {
      console.error('Error in spendCurrency:', error);
      throw error;
    }
  }

  static async recordTransaction(transaction: CriptoAulaTransaction): Promise<void> {
    try {
      const { error } = await supabase
        .from('cripto_aula_transactions')
        .insert(transaction);

      if (error) {
        console.error('Error recording transaction:', error);
      }
    } catch (error) {
      console.error('Error in recordTransaction:', error);
    }
  }

  static async getTransactions(
    studentId: string,
    limit: number = 50,
    transactionType?: CriptoAulaTransaction['transaction_type']
  ): Promise<CriptoAulaTransaction[]> {
    try {
      let query = supabase
        .from('cripto_aula_transactions')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (transactionType) {
        query = query.eq('transaction_type', transactionType);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching transactions:', error);
        return [];
      }

      return data as CriptoAulaTransaction[];
    } catch (error) {
      console.error('Error in getTransactions:', error);
      return [];
    }
  }

  static async processMarketplacePayment(payment: MarketplacePayment): Promise<void> {
    try {
      if (payment.amount_aula_coins > 0) {
        await this.spendCurrency(
          payment.buyer_id,
          'AulaCoins',
          payment.amount_aula_coins,
          'spend_purchase',
          `Compra en marketplace: ${payment.listing_id}`,
          payment.listing_id
        );

        await this.earnCurrency(
          payment.seller_id,
          'AulaCoins',
          payment.amount_aula_coins,
          'earn_marketplace_sale',
          `Venta en marketplace: ${payment.listing_id}`,
          payment.listing_id
        );
      }

      if (payment.amount_cripto_aula > 0) {
        await this.spendCurrency(
          payment.buyer_id,
          'CriptoAula',
          payment.amount_cripto_aula,
          'spend_purchase',
          `Compra en marketplace: ${payment.listing_id}`,
          payment.listing_id
        );

        await this.earnCurrency(
          payment.seller_id,
          'CriptoAula',
          payment.amount_cripto_aula,
          'earn_marketplace_sale',
          `Venta en marketplace: ${payment.listing_id}`,
          payment.listing_id
        );
      }

      const { error } = await supabase
        .from('marketplace_payments')
        .insert(payment);

      if (error) {
        console.error('Error recording marketplace payment:', error);
      }
    } catch (error) {
      console.error('Error in processMarketplacePayment:', error);
      throw error;
    }
  }

  static calculateWalletLevel(
    totalEarnedAulaCoins: number,
    totalEarnedCriptoAula: number
  ): 'Bronce' | 'Plata' | 'Oro' | 'Platino' {
    const totalValue = totalEarnedAulaCoins + totalEarnedCriptoAula * 10;

    if (totalValue >= 10000) return 'Platino';
    if (totalValue >= 5000) return 'Oro';
    if (totalValue >= 2000) return 'Plata';
    return 'Bronce';
  }

  static async getWalletStatistics(studentId: string): Promise<{
    totalTransactions: number;
    earnTransactions: number;
    spendTransactions: number;
    conversionTransactions: number;
    preferredCurrency: 'AulaCoins' | 'CriptoAula' | 'Equal';
  }> {
    try {
      const transactions = await this.getTransactions(studentId, 1000);

      const earnTransactions = transactions.filter(t =>
        t.transaction_type.startsWith('earn_')
      ).length;

      const spendTransactions = transactions.filter(t =>
        t.transaction_type.startsWith('spend_')
      ).length;

      const conversionTransactions = transactions.filter(t =>
        t.transaction_type.startsWith('conversion_')
      ).length;

      const aulaCoinsTransactions = transactions.filter(
        t => t.currency === 'AulaCoins'
      ).length;
      const criptoAulaTransactions = transactions.filter(
        t => t.currency === 'CriptoAula'
      ).length;

      let preferredCurrency: 'AulaCoins' | 'CriptoAula' | 'Equal' = 'Equal';
      if (aulaCoinsTransactions > criptoAulaTransactions) {
        preferredCurrency = 'AulaCoins';
      } else if (criptoAulaTransactions > aulaCoinsTransactions) {
        preferredCurrency = 'CriptoAula';
      }

      return {
        totalTransactions: transactions.length,
        earnTransactions,
        spendTransactions,
        conversionTransactions,
        preferredCurrency
      };
    } catch (error) {
      console.error('Error in getWalletStatistics:', error);
      return {
        totalTransactions: 0,
        earnTransactions: 0,
        spendTransactions: 0,
        conversionTransactions: 0,
        preferredCurrency: 'Equal'
      };
    }
  }
}
