"use client";

import { useEffect } from "react";
import { useAdminDashboardStore } from "@/store/useAdminDashboardStore";
import DashboardCard from "../../components/DashboardCard";
import {
  Users,
  PawPrint,
  CheckCircle2,
  AlertTriangle,
  Home,
} from "lucide-react";

const AdminDashboardPage = () => {
  const { stats, loading, error, fetchDashboardStats } = useAdminDashboardStore();

  useEffect(() => {
  if (!stats) {
    fetchDashboardStats();
  }
}, [stats, fetchDashboardStats]);


  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;
  if (!stats) return null;

  return (
    <div className="p-8 space-y-8">
      {/* Top Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <DashboardCard
          label="Total Owners"
          value={stats.totalOwners}
          icon={<Users />}
          color="blue"
          description="Registered owners in the system"
          href="/admin/manage-users?tab=owners"
        />
        <DashboardCard
          label="Total Vets"
          value={stats.totalVeterinaries}
          icon={<Home />}
          color="green"
          description="Verified veterinary clinics"
          href="/admin/manage-users?tab=veterinaries"
        />
        <DashboardCard
          label="Total Pets"
          value={stats.totalPets}
          icon={<PawPrint />}
          color="purple"
          description="Registered pets"
          href="/admin/manage-users?tab=owners"
        />
        <DashboardCard
          label="Pending Owner Verifications"
          value={stats.pendingOwnerVerifications}
          icon={<CheckCircle2 />}
          color="yellow"
          description="Owners awaiting approval"
          href="/admin/verifications/petOwner"
        />
        <DashboardCard
          label="Pending Vet Verifications"
          value={stats.pendingVetVerifications}
          icon={<CheckCircle2 />}
          color="orange"
          description="Vets awaiting approval"
          href="/admin/verifications/veterinary"
        />
        <DashboardCard
          label="Lost Reports"
          value={stats.lostReports}
          icon={<AlertTriangle />}
          color="red"
          description="Reported lost pets"
          href="/admin/lost-found?tab=lost"
        />
        <DashboardCard
          label="Found Reports"
          value={stats.foundReports}
          icon={<CheckCircle2 />}
          color="teal"
          description="Reported found pets"
          href="/admin/lost-found?tab=found"
        />
      </div>

      {/* Optional: Add charts or tables here later */}
    </div>
  );
};

export default AdminDashboardPage;
