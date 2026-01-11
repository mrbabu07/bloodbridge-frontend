import { Card, Skeleton } from "antd";
import { useTheme } from "../../Context/ThemeContext";

const SkeletonCard = () => {
  const { isDarkMode } = useTheme();

  return (
    <Card
      className={`h-full ${
        isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"
      }`}
    >
      <div className="space-y-4">
        {/* Avatar/Image */}
        <div className="flex items-center gap-3">
          <Skeleton.Avatar active size={64} shape="circle" />
          <div className="flex-1">
            <Skeleton.Input active size="small" className="w-full mb-2" />
            <Skeleton.Input active size="small" className="w-3/4" />
          </div>
        </div>

        {/* Description */}
        <Skeleton active paragraph={{ rows: 2 }} title={false} />

        {/* Meta Info */}
        <div className="space-y-2">
          <Skeleton.Input active size="small" className="w-full" />
          <Skeleton.Input active size="small" className="w-4/5" />
          <Skeleton.Input active size="small" className="w-3/5" />
        </div>

        {/* Button */}
        <Skeleton.Button active size="large" className="w-full" />
      </div>
    </Card>
  );
};

export default SkeletonCard;
