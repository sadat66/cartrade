import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MessageCircle, 
  Car, 
  ArrowUpRight, 
  Plus, 
  Settings,
  Tag,
  ShoppingBag,
  User,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  Zap,
  Clock,
  Briefcase
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n/config";
import type { CurrentUser } from "@/lib/auth";
import { getConversationsForUser } from "@/app/actions/conversation";
import { prisma } from "@/lib/db";
import { resolveListing } from "@/lib/listing-images";
import { cn } from "@/lib/utils";

type Props = {
  user: NonNullable<CurrentUser>;
  locale: Locale;
};

export async function DashboardOverview({ user, locale }: Props) {
  const t = await getTranslations({ locale });
  
  const [
    saved, 
    conversations, 
    userListings, 
  ] = await Promise.all([
    prisma.savedListing.findMany({
      where: { userId: user.id },
      include: { listing: true },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    getConversationsForUser(),
    prisma.listing.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const savedWithResolved = saved.map((item) => ({
    ...item,
    listing: resolveListing(item.listing),
  }));

  const resolvedUserListings = userListings.map(item => resolveListing(item));
  
  // Determine Dynamic Greeting
  const currentHour = new Date().getHours();
  let timeGreeting = "Good Evening";
  if (currentHour < 12) timeGreeting = "Good Morning";
  else if (currentHour < 18) timeGreeting = "Good Afternoon";

  // High-performance status calculations
  const totalLeads = conversations.filter(c => c.sellerId === user.id).length;
  const activeAds = userListings.filter(l => l.status === 'active').length;


  return (
    <div className="container mx-auto px-4 md:px-6 pb-32 py-6 pt-8 lg:pt-14 relative">
      {/* 0. AMBIENT ATMOSPHERE - The Pro Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#3D0066]/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      
      {/* 1. ARCHITECTURAL HEADER - The Pro Command Center */}
      <section className="py-12 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
        <div className="flex items-center gap-8">
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-3xl font-black tracking-tight text-slate-900 animate-in fade-in slide-in-from-left-4 duration-700">
                    <span className="text-slate-400 font-medium">{timeGreeting},</span> {user.name?.split(' ')[0] ?? "User"}
                 </h1>
                 <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 animate-in fade-in zoom-in duration-1000 delay-300">
                    <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Market • Dhaka</span>
                 </div>
              </div>
              <p className="text-slate-500 font-medium tracking-tight">
                 {user.email}
              </p>
           </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <Button asChild variant="outline" className="h-12 w-12 rounded-2xl border-2 border-slate-100 p-0 text-slate-400 hover:text-[#3D0066] hover:bg-slate-50 transition-all">
              <Link href="/profile">
                 <Settings className="size-5" />
              </Link>
           </Button>
           <Button asChild className="h-12 rounded-2xl bg-[#3D0066] hover:bg-[#2A0045] text-white font-bold px-8 shadow-2xl shadow-purple-900/10 active:scale-95 transition-all">
              <Link href="/sell-my-car">
                 <Plus className="size-4 mr-2" />
                 Create New Listing
              </Link>
           </Button>
        </div>
      </section>

      {/* 2. BORDERLESS METRICS - Business Class Visibility */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-0 py-8">
        {[
          { label: 'Active Adverts', val: activeAds, icon: Tag, trend: '+2 this month', href: '/seller/listings' },
          { label: 'Market Enquiries', val: totalLeads, icon: MessageCircle, trend: '4 unread', href: '/messages' },
          { label: 'Watchlist Items', val: saved.length, icon: Heart, trend: 'Updated daily', href: '/saved' },
          { label: 'Profile Reach', val: '2.4k', icon: Zap, trend: 'Top 5% in Dhaka', href: '/profile' }
        ].map((stat, i) => (
          <Link 
            key={i} 
            href={stat.href} 
            className="px-8 py-6 border-l border-slate-100 first:border-0 group transition-all duration-300 hover:bg-slate-100/70 hover:translate-y-[-4px] cursor-pointer rounded-3xl animate-in fade-in slide-in-from-bottom-4 duration-700"
            style={{ animationDelay: `${i * 100}ms` }}
          >
             <div className="flex items-center gap-2 mb-3">
                <div className="size-8 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center transition-all duration-300 group-hover:bg-purple-100 group-hover:text-[#3D0066]">
                   <stat.icon className="size-4" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-slate-600 transition-colors">{stat.label}</span>
             </div>
             <div className="flex items-end gap-3 flex-wrap">
                <span className="text-4xl font-black text-slate-900 leading-none group-hover:text-[#3D0066] transition-colors">{stat.val}</span>
                <span className="text-[10px] font-bold text-emerald-500 mb-1 group-hover:translate-x-1 transition-transform">{stat.trend}</span>
             </div>
          </Link>
        ))}
      </section>

      {/* 3. FLUID CONTENT HUB - The "Least Card" Approach */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-6">
        
        {/* LEADING WING: BUYER & SELLER PORTFOLIO */}
        <div className="lg:col-span-8 space-y-20">
           
           {/* Section: My Selling Portfolio */}
           <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                 <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <LayoutGrid className="size-6 text-[#3D0066]" />
                    Selling Inventory
                 </h2>
                 <Link href="/seller/listings" className="text-xs font-black text-[#3D0066] uppercase hover:underline flex items-center gap-1">
                    Manage Inventory <ChevronRight className="size-3" />
                 </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {resolvedUserListings.length === 0 ? (
                    <div className="col-span-2 py-16 text-center bg-slate-50/50 rounded-[2.5rem] border border-dashed border-slate-200">
                       <p className="text-slate-400 font-bold mb-4">Start your commercial journey here.</p>
                       <Button asChild className="bg-[#3D0066] rounded-xl"><Link href="/sell-my-car">Post Your First Ad</Link></Button>
                    </div>
                 ) : (
                    resolvedUserListings.map((listing) => (
                       <Link key={listing.id} href={`/cars/${listing.id}`} className="block group">
                          <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-slate-100 mb-6 transition-all duration-500 group-hover:shadow-[0_20px_40px_-15px_rgba(61,0,102,0.15)] group-hover:-translate-y-2">
                             {listing.imageUrls[0] ? (
                               <Image src={listing.imageUrls[0]} alt="Car" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                             ) : (
                               <div className="size-full flex items-center justify-center text-slate-200"><Car className="size-12" /></div>
                             )}
                             <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-[#3D0066]">
                                Live
                             </div>
                          </div>
                          <div className="px-2">
                             <h4 className="text-lg font-black text-slate-900 group-hover:text-[#3D0066] transition-colors">{listing.title}</h4>
                             <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-4">
                                   <span className="text-[#3D0066] font-black text-base">${Number(listing.price).toLocaleString()}</span>
                                   <span className="size-1 rounded-full bg-slate-200" />
                                   <span className="text-slate-400 text-xs font-bold">{listing.year}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px] font-bold">
                                   <LayoutGrid className="size-3" />
                                   128 Views
                                </div>
                             </div>
                          </div>
                       </Link>
                    ))
                 )}
              </div>
           </div>

           {/* Section: My Purchasing Interest */}
           <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                 <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                    <ShoppingBag className="size-6 text-slate-400" />
                    Watchlist
                 </h2>
                 <Link href="/saved" className="text-xs font-black text-slate-400 hover:text-slate-600 uppercase transition-colors">See All Items</Link>
              </div>

              <div className="space-y-4">
                 {savedWithResolved.slice(0, 3).map(({ listing }: any) => (
                    <Link key={listing.id} href={`/cars/${listing.id}`} className="flex items-center gap-6 p-4 rounded-3xl hover:bg-slate-50 transition-all group">
                       <div className="size-20 rounded-2xl overflow-hidden bg-slate-100 shrink-0 relative">
                          {listing.imageUrls[0] && <Image src={listing.imageUrls[0]} alt="Car" fill className="object-cover" />}
                       </div>
                       <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-900 truncate leading-tight group-hover:text-[#3D0066] transition-colors">{listing.title}</h4>
                          <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-tighter">{listing.year} • ${Number(listing.price).toLocaleString()}</p>
                       </div>
                       <div className="size-10 rounded-full bg-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
                          <ArrowUpRight className="size-4 text-[#3D0066]" />
                       </div>
                    </Link>
                 ))}
                 {savedWithResolved.length === 0 && <p className="text-slate-400 font-medium italic">Your watchlist is currently empty.</p>}
              </div>
           </div>

        </div>

        {/* SIDE WING: MESSENGER & BUSINESS INSIGHTS */}
        <div className="lg:col-span-4 space-y-16">
           
           {/* Section: Professional Inbox */}
           <div className="space-y-8">
              <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                 <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <MessageCircle className="size-5 text-[#3D0066]" />
                    Inquiries
                 </h2>
                 <Link href="/messages" className="size-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-[#3D0066] hover:bg-purple-100 transition-colors">
                    {conversations.length}
                 </Link>
              </div>

              <div className="space-y-2">
                 {conversations.slice(0, 5).map((c: any) => {
                    const other = user.id === c.buyerId ? c.seller : c.buyer;
                    return (
                       <Link key={c.id} href={`/messages/${c.id}`} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent group">
                          <div className="relative size-12 rounded-2xl overflow-hidden bg-slate-200 shrink-0 shadow-sm">
                             {other.image ? <Image src={other.image} alt="User" fill className="object-cover" /> : <div className="size-full flex items-center justify-center font-black text-[#3D0066] uppercase">{other.name?.[0] ?? '?'}</div>}
                          </div>
                          <div className="min-w-0 flex-1">
                             <div className="flex items-center justify-between">
                                <h5 className="font-bold text-sm text-slate-900 truncate">{other.name ?? "User"}</h5>
                                <span className="text-[10px] font-bold text-slate-300">Active</span>
                             </div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter truncate mt-0.5">{c.listing.title}</p>
                          </div>
                       </Link>
                    )
                 })}
              </div>
           </div>

           {/* Section: Professional Action Card (The only heavy card) */}
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-purple-900/10 group">
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-6">
                 <TrendingUp className="size-32" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-2 mb-6">
                    <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                    <p className="text-[10px] font-black tracking-widest uppercase text-slate-400">Marketing Node</p>
                 </div>
                 <h3 className="text-2xl font-black mb-6 leading-tight">Your listings are outperforming the market by 12%.</h3>
                 
                 {/* Mini Dynamic Sparkline */}
                 <div className="h-12 w-full mb-8 opacity-40">
                    <svg className="size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                       <path 
                          d="M0,80 Q20,30 40,65 T70,15 T100,30" 
                          fill="none" 
                          stroke="#ffffff" 
                          strokeWidth="3" 
                          strokeLinecap="round" 
                          className="drop-shadow-[0_0_8px_white]"
                       />
                    </svg>
                 </div>

                 <div className="space-y-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between">
                       <p className="text-xs font-bold text-slate-400 uppercase">Profile Visibility</p>
                       <p className="text-lg font-black text-white">Top 2%</p>
                    </div>
                    <div className="flex items-center justify-between">
                       <p className="text-xs font-bold text-slate-400 uppercase">Avg Response</p>
                       <p className="text-lg font-black text-white">45 mins</p>
                    </div>
                 </div>
                 <Button asChild className="w-full mt-10 bg-[#3D0066] hover:bg-[#2A0045] text-white rounded-2xl font-black h-12 shadow-xl shadow-slate-900 active:scale-95 transition-all">
                    <Link href="/seller/listings">Boost Portfolio</Link>
                 </Button>
              </div>
           </div>


        </div>

      </div>
    </div>
  );
}
