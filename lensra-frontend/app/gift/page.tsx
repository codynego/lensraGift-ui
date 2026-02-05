// "use client";

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Loader2, Gift, ArrowRight, Share2 } from 'lucide-react';

// const BaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.lensra.com/";

// export default function ViralLandingPage() {
//   const router = useRouter();
//   const [whatsapp, setWhatsapp] = useState('');
//   const [name, setName] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [previewData, setPreviewData] = useState<any>(null);
//   const [inviteLink, setInviteLink] = useState<string | null>(null);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       // Step 1: Create Lead
//       const leadResponse = await fetch(`${BaseUrl}api/leads/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ whatsapp, name }),
//       });

//       if (!leadResponse.ok) {
//         throw new Error('Failed to create lead');
//       }

//       const leadData = await leadResponse.json();

//       // Step 2: Generate Invite Link
//       const inviteResponse = await fetch(`${BaseUrl}api/leads/invites/`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ owner: leadData.id }),
//       });

//       if (!inviteResponse.ok) {
//         throw new Error('Failed to create invite link');
//       }

//       const inviteData = await inviteResponse.json();
//       setInviteLink(`${window.location.origin}/leads/invite/${inviteData.code}`);

//       // Step 3: Fetch Gift Preview
//       const previewResponse = await fetch(`${BaseUrl}api/leads/previews/${leadData.id}/`);
//       if (!previewResponse.ok) {
//         throw new Error('Failed to fetch preview');
//       }

//       const preview = await previewResponse.json();
//       setPreviewData(preview);
//       router.push('/gift/processing'); // Or handle in-page

//     } catch (err) {
//       setError('Something went wrong. Please try again.');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
//       <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center space-y-8">
//         <div className="space-y-4">
//           <Gift className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
//           <h1 className="text-3xl font-bold text-zinc-900">
//             Someone Is About to Gift You Something Special 🎁
//           </h1>
//           <p className="text-zinc-600 text-lg">
//             We help people turn memories into surprise gifts. Enter your WhatsApp to see what they might send you.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="tel"
//             placeholder="Your WhatsApp Number"
//             value={whatsapp}
//             onChange={(e) => setWhatsapp(e.target.value)}
//             className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-zinc-900"
//             required
//           />
//           <input
//             type="text"
//             placeholder="Your Name (optional)"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full px-4 py-3 rounded-xl border border-zinc-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none text-zinc-900"
//           />
//           {error && <p className="text-red-500 text-sm">{error}</p>}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-4 bg-red-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50"
//           >
//             {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
//               <>
//                 Reveal My Gift <ArrowRight className="w-5 h-5" />
//               </>
//             )}
//           </button>
//         </form>

//         {previewData && (
//           <div className="space-y-4 animate-in fade-in">
//             <h2 className="text-xl font-bold text-zinc-900">Your Gift Preview</h2>
//             <div className="grid grid-cols-3 gap-2">
//               {/* Render blurred previews */}
//               <img src={previewData.blurred_image1 || '/placeholder-mug.jpg'} alt="Mug Preview" className="rounded-xl filter blur-sm" />
//               <img src={previewData.blurred_image2 || '/placeholder-frame.jpg'} alt="Frame Preview" className="rounded-xl filter blur-sm" />
//               <img src={previewData.blurred_image3 || '/placeholder-box.jpg'} alt="Box Preview" className="rounded-xl filter blur-sm" />
//             </div>
//             <p className="text-zinc-600">This is just a preview. The real gift comes when someone completes it.</p>
//             <button
//               onClick={() => router.push('/gift-someone')}
//               className="w-full py-4 bg-zinc-900 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-zinc-800 transition-all"
//             >
//               I Want to Gift Someone Too <Gift className="w-5 h-5" />
//             </button>
//           </div>
//         )}

//         {inviteLink && (
//           <div className="space-y-2 pt-4 border-t border-zinc-200">
//             <p className="text-zinc-600 font-semibold">Share the Surprise!</p>
//             <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-xl">
//               <input
//                 type="text"
//                 value={inviteLink}
//                 readOnly
//                 className="flex-1 bg-transparent text-zinc-900 text-sm"
//               />
//               <button
//                 onClick={() => navigator.clipboard.writeText(inviteLink)}
//                 className="p-2 bg-red-100 rounded-lg hover:bg-red-200 transition-all"
//               >
//                 <Share2 className="w-4 h-4 text-red-600" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


