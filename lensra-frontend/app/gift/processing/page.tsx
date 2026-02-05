"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Gift, ArrowRight, Share2 } from 'lucide-react';

const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

export default function ProcessingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [previewData, setPreviewData] = useState<any>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Assuming leadId is passed via query param from landing page after lead creation
  const leadId = searchParams.get('leadId');

  useEffect(() => {
    if (!leadId) {
      setError('Invalid access. Please submit the form again.');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Fetch Invite Link (assuming backend creates it automatically or fetch existing)
        const inviteResponse = await fetch(`${BaseUrl}api/leads/invites/?owner=${leadId}`);
        const inviteData = await inviteResponse.json();
        if (inviteData.length > 0) {
          setInviteLink(`${window.location.origin}/invite/${inviteData[0].code}`);
        }

        // Fetch Gift Preview
        const previewResponse = await fetch(`${BaseUrl}api/leads/previews/${leadId}/`);
        if (!previewResponse.ok) {
          throw new Error('Failed to fetch preview');
        }
        const preview = await previewResponse.json();
        setPreviewData(preview);

      } catch (err) {
        setError('Something went wrong. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [leadId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
          <Loader2 className="w-16 h-16 text-red-500 mx-auto animate-spin" />
          <h1 className="text-2xl font-bold text-zinc-900">
            We’re preparing your personalized gift preview...
          </h1>
          <p className="text-zinc-600">This will only take a moment 🎁</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-6">
          <h1 className="text-2xl font-bold text-red-600">{error}</h1>
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-8">
        <div className="space-y-4">
          <Gift className="w-16 h-16 text-red-500 mx-auto" />
          <h1 className="text-3xl font-bold text-zinc-900">Your Gift Preview is Ready!</h1>
          <p className="text-zinc-600 text-lg">
            Check your WhatsApp for a special message. Here&apos;s a sneak peek...
          </p>
        </div>

        {previewData && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              {/* Assuming previewData has blurred_image fields; adjust based on serializer */}
              <img src={previewData.blurred_image || '/placeholder-mug.jpg'} alt="Mug Preview" className="rounded-xl filter blur-sm aspect-square object-cover" />
              <img src={previewData.blurred_image || '/placeholder-frame.jpg'} alt="Frame Preview" className="rounded-xl filter blur-sm aspect-square object-cover" />
              <img src={previewData.blurred_image || '/placeholder-box.jpg'} alt="Box Preview" className="rounded-xl filter blur-sm aspect-square object-cover" />
            </div>
            <p className="text-zinc-600">This is just a preview. The real gift comes when someone completes it.</p>
          </div>
        )}

        <button
          onClick={() => router.push('/gift-someone')}
          className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-all"
        >
          I Want to Gift Someone Too <ArrowRight className="w-5 h-5" />
        </button>

        {inviteLink && (
          <div className="space-y-2 pt-4 border-t border-zinc-200">
            <p className="text-zinc-600 font-semibold">Share the Magic!</p>
            <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-xl">
              <input
                type="text"
                value={inviteLink}
                readOnly
                className="flex-1 bg-transparent text-zinc-900 text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(inviteLink)}
                className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-all"
              >
                <Share2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
            <p className="text-xs text-zinc-500">Forward to friends and see the surprises unfold 👀</p>
          </div>
        )}
      </div>
    </div>
  );
}