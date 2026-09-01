import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';
import {
  ShoppingBag,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Calculator,
  Store,
  Tag,
  ArrowRight,
  UserCheck,
  Percent,
  Receipt,
  RotateCcw,
} from 'lucide-react';

export const PosTerminalSimulator: React.FC = () => {
  const { isPosModalOpen, setIsPosModalOpen, pilotBusinesses, affiliates, logNewRedemption, showToast } = useApp();

  const [selectedBizId, setSelectedBizId] = useState<string>('biz-hitech');
  const [selectedTerminal, setSelectedTerminal] = useState<string>('POS-HITECH-MAIN-VI');
  const [promoCodeInput, setPromoCodeInput] = useState<string>('PW-CHIDI-TECH');
  const [grossAmountNgn, setGrossAmountNgn] = useState<number>(3450000);
  const [customerName, setCustomerName] = useState<string>('Chief Bayo Adeleke');
  const [customerPhone, setCustomerPhone] = useState<string>('+234 803 555 1234');
  const [itemsSummary, setItemsSummary] = useState<string>('MacBook Pro 16" M3 Max 64GB 1TB Space Black');

  const [validationResult, setValidationResult] = useState<any>(null);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [redemptionReceipt, setRedemptionReceipt] = useState<any>(null);

  if (!isPosModalOpen) return null;

  const currentBiz = pilotBusinesses.find(b => b.id === selectedBizId) || pilotBusinesses[0];

  const handleValidateCode = async () => {
    if (!promoCodeInput.trim()) return;
    setIsValidating(true);
    setValidationResult(null);
    try {
      const res = await api.validatePromoCode({
        promoCode: promoCodeInput.trim(),
        businessId: selectedBizId,
        grossAmountNgn: Number(grossAmountNgn) || 1000000,
      });
      setValidationResult(res);
    } catch (err: any) {
      setValidationResult({ valid: false, message: err.message || 'Validation request failed' });
    } finally {
      setIsValidating(false);
    }
  };

  const handleProcessRedemption = async () => {
    setIsProcessing(true);
    try {
      const result = await logNewRedemption({
        promoCode: promoCodeInput.trim(),
        businessId: selectedBizId,
        grossAmountNgn: Number(grossAmountNgn),
        customerName: customerName || 'Walk-in Customer',
        customerPhone: customerPhone || '+234 800 000 0000',
        itemsSummary: itemsSummary || 'Pilot Store Purchase',
        posTerminalId: selectedTerminal,
      });
      setRedemptionReceipt(result);
    } catch (err) {
      // toast is handled in AppContext
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setRedemptionReceipt(null);
    setValidationResult(null);
    setGrossAmountNgn(2800000);
    setItemsSummary('Commercial Equipment Batch');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-amber-500/40 bg-slate-900 shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-white font-mono">
                PILOT POS CHECKOUT TERMINAL
              </h2>
              <p className="text-[11px] text-slate-400">
                Simulating Ingestion from HiTech / Jotra / O Frank into <code className="text-amber-400 font-mono">promo_redemptions</code>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPosModalOpen(false)}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Terminal Body */}
        <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6">
          {redemptionReceipt ? (
            /* Success Receipt Screen */
            <div className="space-y-5 text-center animate-in zoom-in-95 duration-200">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <h3 className="text-xl font-black text-white">Redemption Processed & Ingested</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Logged directly to universal table <span className="text-amber-400 font-mono">promo_redemptions</span>
                </p>
              </div>

              <div className="mx-auto max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-5 text-left text-xs space-y-2.5">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="font-mono font-bold text-white">{redemptionReceipt.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Partner Store:</span>
                  <span className="font-bold text-slate-200">{redemptionReceipt.businessName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Affiliate Credited:</span>
                  <span className="font-bold text-amber-400">{redemptionReceipt.affiliateName}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Promo Code Used:</span>
                  <span className="font-mono font-bold text-amber-400">{redemptionReceipt.promoCode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Gross Total:</span>
                  <span className="font-bold text-white">₦{redemptionReceipt.grossAmountNgn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Customer Discount:</span>
                  <span className="font-bold text-red-400">-₦{redemptionReceipt.discountAmountNgn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Affiliate Commission Payout:</span>
                  <span className="font-bold text-emerald-400">+₦{redemptionReceipt.commissionAmountNgn.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-black text-white">
                  <span>Net Paid by Customer:</span>
                  <span className="text-amber-400">
                    ₦{(redemptionReceipt.grossAmountNgn - redemptionReceipt.discountAmountNgn).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  <RotateCcw className="h-3.5 w-3.5 inline mr-1" /> New Transaction
                </button>
                <button
                  onClick={() => setIsPosModalOpen(false)}
                  className="rounded-xl bg-amber-500 px-5 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
                >
                  Close Terminal
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Input Form */
            <div className="space-y-4 text-xs">
              {/* Partner Business Selector */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  1. Select Point-of-Sale Pilot Partner:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {pilotBusinesses.map(biz => (
                    <button
                      key={biz.id}
                      onClick={() => {
                        setSelectedBizId(biz.id);
                        setSelectedTerminal(biz.posTerminals[0] || 'POS-01');
                        setValidationResult(null);
                      }}
                      className={`flex flex-col items-start rounded-xl p-3 text-left transition cursor-pointer border ${
                        selectedBizId === biz.id
                          ? 'border-amber-500 bg-amber-500/10 text-white shadow'
                          : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="font-bold text-xs">{biz.name}</div>
                      <div className="text-[10px] text-amber-400 mt-0.5">
                        {biz.defaultDiscountPct}% Discount ({biz.fundingModel})
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Terminal & Items info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Active POS Terminal ID</label>
                  <select
                    value={selectedTerminal}
                    onChange={e => setSelectedTerminal(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white font-mono"
                  >
                    {currentBiz.posTerminals.map(term => (
                      <option key={term} value={term}>{term}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Cart Total Amount (₦ NGN)</label>
                  <input
                    type="number"
                    step="10000"
                    value={grossAmountNgn}
                    onChange={e => {
                      setGrossAmountNgn(Number(e.target.value));
                      setValidationResult(null);
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-amber-400 font-bold font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Purchased Items Description</label>
                <input
                  type="text"
                  value={itemsSummary}
                  onChange={e => setItemsSummary(e.target.value)}
                  placeholder="e.g. M3 Max MacBook Pro 16-inch..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white"
                />
              </div>

              {/* Promo Code Verification Box */}
              <div className="rounded-2xl border border-amber-500/30 bg-slate-950 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Tag className="h-4 w-4" />
                    <span>2. Enter Affiliate Promo Code:</span>
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Quick test: <button type="button" onClick={() => setPromoCodeInput('PW-CHIDI-TECH')} className="underline text-amber-300">PW-CHIDI-TECH</button> or <button type="button" onClick={() => setPromoCodeInput('PW-AMAKA-LIVING')} className="underline text-amber-300">PW-AMAKA-LIVING</button>
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={e => {
                      setPromoCodeInput(e.target.value.toUpperCase());
                      setValidationResult(null);
                    }}
                    placeholder="e.g. PW-CHIDI-TECH"
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-mono font-bold text-white uppercase focus:border-amber-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleValidateCode}
                    disabled={isValidating}
                    className="rounded-xl bg-amber-500 px-4 py-2 font-bold text-slate-950 hover:bg-amber-400 transition cursor-pointer"
                  >
                    {isValidating ? 'Validating...' : 'Validate Code'}
                  </button>
                </div>

                {/* Validation Output */}
                {validationResult && (
                  <div className={`rounded-xl p-3 border text-xs ${
                    validationResult.valid
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/40 border-red-500/40 text-red-300'
                  }`}>
                    {validationResult.valid ? (
                      <div className="space-y-1.5">
                        <div className="flex justify-between font-bold">
                          <span>✓ Valid: {validationResult.affiliateName} ({validationResult.affiliateTier} tier)</span>
                          <span className="font-mono text-amber-300">Origin: {validationResult.clientName}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-300">
                          <div>Discount: <strong>-₦{validationResult.discountAmountNgn.toLocaleString()}</strong> ({validationResult.discountPct}%)</div>
                          <div>Commission: <strong>+₦{validationResult.commissionAmountNgn.toLocaleString()}</strong> ({validationResult.commissionPct}%)</div>
                          <div>Payable: <strong className="text-amber-400">₦{validationResult.netPayableNgn.toLocaleString()}</strong></div>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Funding Model: <strong>{validationResult.fundingModel}</strong>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <span>{validationResult.message}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Customer Full Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Customer Phone</label>
                  <input
                    type="text"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsPosModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcessRedemption}
                  disabled={isProcessing || !promoCodeInput.trim()}
                  className="rounded-xl bg-emerald-600 px-6 py-2.5 font-bold text-white hover:bg-emerald-500 shadow-lg shadow-emerald-950/60 transition cursor-pointer disabled:opacity-50"
                >
                  {isProcessing ? 'Processing Transaction...' : 'Confirm & Process POS Redemption'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
