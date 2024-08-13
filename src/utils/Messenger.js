// notificationHelper.js
import { notification } from "antd";
import {
  SmileOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const iconTypes = {
  success: <SmileOutlined style={{ color: "#52c41a" }} />,
  info: <InfoCircleOutlined style={{ color: "#1890ff" }} />,
  warning: <WarningOutlined style={{ color: "#faad14" }} />,
  error: <CloseOutlined style={{ color: "#ff8d4f" }} />,
};

export const openNotification = (
  type,
  message,
  description,
  duration = 3,
  placement = "topRight"
) => {
  notification[type]({
    message: message,
    description: description,
    icon: iconTypes[type],
    duration: duration,
    placement: placement,
  });
};
