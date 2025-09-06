import { useRouter } from "next/navigation";
import { ArrowLeft, LucideIcon } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
}

export default function AdminPageHeader({
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-gray-600",
  iconBgColor = "bg-gray-100",
}: AdminPageHeaderProps) {
  const router = useRouter();

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="p-1.5 md:p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <div
                className={`w-8 h-8 md:w-10 md:h-10 ${iconBgColor} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-4 h-4 md:w-6 md:h-6 ${iconColor}`} />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-900">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs md:text-sm text-gray-500">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
