import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'

import Layout from './components/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import Crm from './pages/Crm'
import AlaPrivate from './pages/AlaPrivate'
import Inventory from './pages/Inventory'
import Billing from './pages/Billing'
import Notifications from './pages/Notifications'
import Analytics from './pages/Analytics'
import LoyaltyAdmin from './pages/LoyaltyAdmin'
import SupportInbox from './pages/SupportInbox'
import WhatsAppBot from './pages/WhatsAppBot'
import ImportDre from './pages/ImportDre'

import MemberLayout from './components/member/MemberLayout'
import MemberPortal from './pages/member/Portal'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/crm" element={<Crm />} />
          <Route path="/ala-private" element={<AlaPrivate />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/import-dre" element={<ImportDre />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/loyalty" element={<LoyaltyAdmin />} />
          <Route path="/support" element={<SupportInbox />} />
          <Route path="/bot" element={<WhatsAppBot />} />
        </Route>

        {/* Dedicated App Portal for Members */}
        <Route element={<MemberLayout />}>
          <Route path="/member/portal" element={<MemberPortal />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </BrowserRouter>
)

export default App
