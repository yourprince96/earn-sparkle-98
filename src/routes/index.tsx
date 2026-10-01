import React, { useState, useEffect } from 'react';

// ==========================================
// ১. টাস্ক ও ভিআইপি টাইপস (Task & VIP Types)
// ==========================================
export type TaskCategory = 
  | 'account_sale' 
  | 'coin_sale' 
  | 'website_visit' 
  | 'whatsapp_bind';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  platform: 'gmail' | 'facebook' | 'whatsapp' | 'telegram' | 'instagram' | 'neva' | 'ns' | 'coinsta' | 'other';
  reward_amount: number;
  vip_required: boolean;
  min_vip_level?: string;
  ad_required: boolean;
  ad_duration_seconds: number;
}

export interface VIPPlan {
  id: string;
  name: string;
  price_bdt: number;
  duration_days: number;
  daily_task_limit: number;
}

// ==========================================
// ২. ১০ সেকেন্ডের অ্যাড মডাল (10-Sec Ad Modal)
// ==========================================
interface TaskAdModalProps {
  isOpen: boolean;
  onAdComplete: () => void;
  onCancel: () => void;
}

export const TaskAdModal: React.FC<TaskAdModalProps> = ({ isOpen, onAdComplete, onCancel }) => {
  const [timeLeft, setTimeLeft] = useState(10);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      setTimeLeft(10);
      setCanSkip(false);
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanSkip(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full text-center shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-2">বিজ্ঞাপন দেখুন</h3>
        <p className="text-sm text-gray-600 mb-4">
          টাস্কটি চালু করতে ১০ সেকেন্ডের এই বিজ্ঞাপনটি সম্পূর্ণ দেখুন।
        </p>

        {/* Adsterra Banner Placeholder */}
        <div className="my-4 bg-gray-100 border border-dashed border-gray-400 rounded p-6 flex flex-col items-center justify-center min-h-[150px]">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">[ Adsterra Ad Unit ]</span>
          <p className="text-xs text-gray-400 mt-1">বিজ্ঞাপন চলাকালীন পেজ বন্ধ করবেন না</p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {!canSkip ? (
            <button disabled className="w-full bg-gray-300 text-gray-600 py-2.5 rounded-lg font-medium cursor-not-allowed">
              অপেক্ষা করুন ({timeLeft}s)
            </button>
          ) : (
            <button 
              onClick={onAdComplete} 
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition"
            >
              টাস্কে এগিয়ে যান
            </button>
          )}

          <button 
            onClick={onCancel} 
            className="w-full text-sm text-red-500 hover:underline py-1 mt-1"
          >
            বাতিল করুন
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// ৩. স্পিন উইথ ফি (Spin & Earn Component)
// ==========================================
interface SpinProps {
  userBalance: number;
  spinFee?: number;
  onSpinSuccess: (reward: number) => void;
}

export const SpinAndEarn: React.FC<SpinProps> = ({ userBalance, spinFee = 5, onSpinSuccess }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [message, setMessage] = useState('');

  const handleSpin = () => {
    if (userBalance < spinFee) {
      setMessage(`স্পিন করতে কমপক্ষে ৳${spinFee} ব্যালেন্স প্রয়োজন!`);
      return;
    }

    setIsSpinning(true);
    setMessage('স্পিন ঘুরছে...');

    setTimeout(() => {
      const rewards = [2, 5, 10, 15, 0, 20];
      const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
      setIsSpinning(false);
      onSpinSuccess(randomReward);
      setMessage(`অভিনন্দন! আপনি ৳${randomReward} বোনাস পেয়েছেন।`);
    }, 3000);
  };

  return (
    <div className="bg-white border rounded-xl p-6 text-center shadow-md max-w-sm mx-auto my-6">
      <h2 className="text-xl font-bold mb-2 text-indigo-700">স্পিন অ্যান্ড আর্ন</h2>
      <p className="text-xs text-gray-500 mb-4">প্রতিটি স্পিনের ফি: ৳{spinFee}</p>

      <div className={`w-32 h-32 rounded-full border-4 border-indigo-500 border-t-indigo-200 mx-auto flex items-center justify-center my-4 bg-indigo-50 ${isSpinning ? 'animate-spin' : ''}`}>
        <span className="text-2xl font-black text-indigo-600">SPIN</span>
      </div>

      {message && <p className="text-sm font-medium text-amber-600 my-2">{message}</p>}

      <button
        onClick={handleSpin}
        disabled={isSpinning}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {isSpinning ? 'অপেক্ষা করুন...' : `৳${spinFee} দিয়ে স্পিন করুন`}
      </button>
    </div>
  );
};

// ==========================================
// ৪. ডেমো ফিচার মেইন পেজ (Main Combined View)
// ==========================================
export default function TaskAndEarnFeatures() {
  const [userBalance, setUserBalance] = useState(50); // Sample balance BDT
  const [isAdOpen, setIsAdOpen] = useState(false);

  const handleTaskClick = () => {
    setIsAdOpen(true);
  };

  const handleAdComplete = () => {
    setIsAdOpen(false);
    alert('বিজ্ঞাপন দেখা সম্পন্ন হয়েছে! এখন আপনি টাস্কটি পূরণ করতে পারবেন।');
  };

  const handleSpinSuccess = (reward: number) => {
    setUserBalance((prev) => prev - 5 + reward);
  };

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-6">
      <div className="bg-indigo-600 text-white p-4 rounded-xl flex justify-between items-center shadow">
        <div>
          <h1 className="text-lg font-bold">টাস্ক অ্যান্ড আর্ন ড্যাশবোর্ড</h1>
          <p className="text-xs text-indigo-200">আপনার বর্তমান ব্যালেন্স</p>
        </div>
        <div className="text-2xl font-extrabold">৳{userBalance}</div>
      </div>

      {/* টাস্ক খোলার নমুনা বাটান */}
      <div className="bg-white p-4 border rounded-xl shadow-sm text-center">
        <h3 className="font-bold text-gray-800 mb-2">একাউন্ট সেল টাস্ক (জিমেইল / ফেসবুক)</h3>
        <button 
          onClick={handleTaskClick} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition"
        >
          টাস্ক শুরু করুন (১০ সেকেন্ড অ্যাড থাকবে)
        </button>
      </div>

      {/* স্পিন কম্পোনেন্ট */}
      <SpinAndEarn 
        userBalance={userBalance} 
        spinFee={5} 
        onSpinSuccess={handleSpinSuccess} 
      />

      {/* বাধ্যতামূলক অ্যাড মডাল */}
      <TaskAdModal 
        isOpen={isAdOpen} 
        onAdComplete={handleAdComplete} 
        onCancel={() => setIsAdOpen(false)} 
      />
    </div>
  );
            }
  
  import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
// ... বাকি UI কম্পোনেন্ট এবং স্টেট

export const Route = createFileRoute('/')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'TaskEarn — টাস্ক করে ইনকাম করুন' },
      { name: 'description', content: 'সহজ টাস্ক সম্পন্ন করে প্রতিদিন আয় করুন।' },
    ],
  }),
  component: AuthPage,
});
