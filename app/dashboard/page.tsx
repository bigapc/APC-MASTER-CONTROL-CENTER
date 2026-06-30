import CommandCenterHero from "@/components/CommandCenterHero";
import ExecutiveMetrics from "@/components/ExecutiveMetrics";
import PlatformStatusBoard from "@/components/PlatformStatusBoard";
import APCCommandMap from "@/components/APCCommandMap";
import ActivityFeed from "@/components/ActivityFeed";
import AlertsCenter from "@/components/AlertsCenter";
import NotificationCenter from "@/components/NotificationCenter";
import OperationalChecklist from "@/components/OperationalChecklist";
import QuickActionsPanel from "@/components/QuickActionsPanel";
import OperationsTimelinePanel from "@/components/OperationsTimelinePanel";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import CommandHeader from "@/components/CommandHeader";
import MasterPlatformScope from "@/components/MasterPlatformScope";

export default function DashboardPage() {
  return (
    <ExecutiveLayout>
      <CommandHeader />

      <div className="space-y-8">
        <CommandCenterHero />

        <MasterPlatformScope />

        <ExecutiveMetrics />

        <PlatformStatusBoard />

        <APCCommandMap />

        <ActivityFeed />

        <OperationsTimelinePanel />

        <AlertsCenter />

        <NotificationCenter />

        <OperationalChecklist />

        <QuickActionsPanel />
      </div>
    </ExecutiveLayout>
  );
}
