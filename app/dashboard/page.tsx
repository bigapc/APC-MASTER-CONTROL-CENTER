import CommandCenterHero from "@/components/CommandCenterHero";
import ExecutiveMetrics from "@/components/ExecutiveMetrics";
import PlatformStatusBoard from "@/components/PlatformStatusBoard";
import APCCommandMap from "@/components/APCCommandMap";
import ActivityFeed from "@/components/ActivityFeed";
import AlertsCenter from "@/components/AlertsCenter";
import NotificationCenter from "@/components/NotificationCenter";
import OperationalChecklist from "@/components/OperationalChecklist";
import QuickActionsPanel from "@/components/QuickActionsPanel";
import ExecutiveLayout from "@/components/layouts/ExecutiveLayout";
import CommandHeader from "@/components/CommandHeader";

export default function DashboardPage() {
  return (
    <ExecutiveLayout>
      <CommandHeader />

      <div className="space-y-8">
        <CommandCenterHero />

        <ExecutiveMetrics />

        <PlatformStatusBoard />

        <APCCommandMap />

        <ActivityFeed />

        <AlertsCenter />

        <NotificationCenter />

        <OperationalChecklist />

        <QuickActionsPanel />
      </div>
    </ExecutiveLayout>
  );
}
