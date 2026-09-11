import React, { useState, useEffect } from 'react';
import { CartItem, ShippingAddress, PaymentMethod } from '../types';
import { X, Check, ShieldCheck, ArrowRight, ArrowLeft, Truck, CreditCard, Smartphone, Building, Wallet, Banknote, Sparkles, Package } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audio';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderComplete: () => void;
}

const STEPS = ['Shipping Address', 'Contact Info', 'Review Order', 'Payment Mode', 'Confirmed'];

export const CheckoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderComplete,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Arjun Verma',
    phone: '9876543210',
    email: 'arjun.verma@example.com',
    street: '402, Signature Heights, Linking Road',
    apartment: 'Floor 4, Wing B',
    city: 'Mumbai',
    state: 'Maharashtra',
    pinCode: '400050',
    addressType: 'home',
    instructions: 'Please call before arriving',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [orderNumber, setOrderNumber] = useState<string>('');

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  const handleNextStep = () => {
    audioEngine.playClick();
    if (currentStep === 3) {
      // Place Order Step
      const generatedOrder = 'HB-' + Math.floor(100000 + Math.random() * 900000);
      setOrderNumber(generatedOrder);
      setCurrentStep(4);
      onOrderComplete();
      audioEngine.playSuccess();

      // Launch Confetti
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ffffff', '#a1a1aa', '#71717a', '#27272a'],
        });
      } catch {}
    } else {
      setCurrentStep((prev) => Math.min(STEPS.length - 1, prev + 1));
    }
  };

  const handlePrevStep = () => {
    audioEngine.playClick();
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-300"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl rounded-3xl bg-neutral-950 border border-zinc-800 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col justify-between"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-neutral-900">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-zinc-400">
              SECURE CHECKOUT • STEP {currentStep + 1} OF 5
            </span>
            <h2 className="text-xl font-bold text-white mt-0.5">
              {STEPS[currentStep]}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="flex w-full bg-neutral-900 h-1">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`flex-1 transition-all duration-300 ${
                i <= currentStep ? 'bg-white' : 'bg-zinc-800'
              }`}
            />
          ))}
        </div>

        {/* Step Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* STEP 0: Address */}
          {currentStep === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-zinc-800 text-sm text-white focus:border-white outline-none"
                    placeholder="Recipient's Name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={address.pinCode}
                    onChange={(e) => setAddress({ ...address, pinCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-zinc-800 text-sm text-white font-mono focus:border-white outline-none"
                    placeholder="6-Digit Postal Code"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Street Address & Flat / Building
                </label>
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-zinc-800 text-sm text-white focus:border-white outline-none mb-2"
                  placeholder="House No, Apartment, Street"
                />
                <input
                  type="text"
                  value={address.apartment}
                  onChange={(e) => setAddress({ ...address, apartment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-zinc-800 text-sm text-white focus:border-white outline-none"
                  placeholder="Landmark or Area Locality"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-zinc-800 text-sm text-white focus:border-white outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-zinc-800 text-sm text-white focus:border-white outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 1: Contact */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Mobile Number (For WhatsApp / SMS Delivery Updates)
                </label>
                <div className="flex gap-2">
                  <span className="px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-zinc-800 text-sm text-zinc-400 font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-zinc-800 text-sm text-white font-mono focus:border-white outline-none"
                    placeholder="10-Digit Mobile"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Email Address for Invoicing & Tracking
                </label>
                <input
                  type="email"
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-zinc-800 text-sm text-white focus:border-white outline-none"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider block mb-1">
                  Delivery Landmark / Gate Instructions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={address.instructions}
                  onChange={(e) => setAddress({ ...address, instructions: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-zinc-800 text-sm text-white focus:border-white outline-none"
                  placeholder="e.g. Leave with building security"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Review Order */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="divide-y divide-zinc-800 max-h-48 overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.images[0]} alt={item.name} className="w-12 h-14 rounded-lg object-cover bg-neutral-900" />
                      <div>
                        <h4 className="text-xs font-semibold text-white">{item.name}</h4>
                        <span className="text-[11px] text-zinc-400">
                          Size: {item.selectedSize} • Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white font-mono">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-neutral-900 border border-zinc-800 text-xs space-y-2">
                <div className="flex justify-between text-zinc-400">
                  <span>Shipping Address:</span>
                  <span className="text-white text-right max-w-xs truncate">
                    {address.street}, {address.city} - {address.pinCode}
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Delivery Speed:</span>
                  <span className="text-white font-semibold">⚡ HEY BRO Express (2-3 Days)</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Contact:</span>
                  <span className="text-white">{address.phone}</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {currentStep === 3 && (
            <div className="space-y-3">
              {[
                { id: 'upi', name: 'Instant UPI (Google Pay, PhonePe, Paytm, BHIM)', icon: Smartphone, desc: '0% Transaction Fee • Instant Verification' },
                { id: 'card', name: 'Credit / Debit Cards (Visa, Mastercard, RuPay, Amex)', icon: CreditCard, desc: 'Secured via 256-Bit SSL Encryption' },
                { id: 'netbanking', name: 'Net Banking (All Major Indian Banks)', icon: Building, desc: 'SBI, HDFC, ICICI, Axis, Kotak & 50+ Banks' },
                { id: 'cod', name: 'Cash on Delivery (COD)', icon: Banknote, desc: 'Pay when your luxury package arrives at door' },
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setPaymentMethod(opt.id as PaymentMethod);
                      audioEngine.playClick();
                    }}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3.5 transition-all ${
                      isSelected
                        ? 'bg-zinc-800 border-white ring-2 ring-white/30'
                        : 'bg-neutral-900 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-300'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-semibold text-white">{opt.name}</h4>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* STEP 4: Confirmed Order Screen */}
          {currentStep === 4 && (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 rounded-full bg-white text-black flex items-center justify-center mx-auto shadow-2xl shadow-white/20">
                <Check className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-400">
                  PAYMENT SUCCESSFUL • ORDER CONFIRMED
                </span>
                <h3 className="font-['Bebas_Neue'] text-4xl text-white tracking-wider">
                  THANK YOU FOR CHOOSING HEY BRO!
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  Your luxury garments are now being hand-inspected, steam-pressed, and packed in our signature matte black gift box.
                </p>
              </div>

              {/* Order Tracking Card */}
              <div className="p-5 rounded-2xl bg-neutral-900 border border-zinc-800 text-left space-y-4 max-w-md mx-auto">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                  <div>
                    <span className="text-[10px] uppercase text-zinc-500 font-mono block">Order Tracking ID</span>
                    <span className="font-mono text-sm font-bold text-white">{orderNumber}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white text-black">
                    Preparing Shipment
                  </span>
                </div>

                {/* Timeline */}
                <div className="space-y-3 text-xs">
                  <div className="flex items-center gap-3 text-white">
                    <span className="w-3 h-3 rounded-full bg-white" />
                    <span>Order Placed & Verified ({new Date().toLocaleDateString()})</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-300">
                    <span className="w-3 h-3 rounded-full bg-zinc-400 animate-ping" />
                    <span>Garment Quality Audit & Packaging</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-600">
                    <span className="w-3 h-3 rounded-full bg-zinc-700" />
                    <span>Dispatched via Bluedart Air Express</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-600">
                    <span className="w-3 h-3 rounded-full bg-zinc-700" />
                    <span>Delivered to {address.city} (2–3 Days)</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-6 border-t border-zinc-800 bg-neutral-900 flex items-center justify-between">
          {currentStep > 0 && currentStep < 4 ? (
            <button
              onClick={handlePrevStep}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              onClick={handleNextStep}
              className="flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/10 hover:scale-105 active:scale-95"
            >
              <span>{currentStep === 3 ? `PAY ₹${total.toLocaleString()} & PLACE ORDER` : 'CONTINUE'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-4 rounded-full bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-all"
            >
              Continue Shopping
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
