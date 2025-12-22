import { Activity, Archive, Clock } from "lucide-react";

export const statusIndicator = {
        "in progress": {
        icon: <Clock className="w-4 h-4 text-yellow-500" />,
        description: "This project is currently in progress and being actively worked on. you can apply",
    },
        archived: {
        icon: <Archive className="w-4 h-4 text-gray-500" />,
        description: "This project has been archived and is no longer active. you cannot apply",
    },
        active: {
        icon: <Activity className="w-4 h-4 text-green-500" />,
        description: "This project is live and available for interaction or updates. you can apply",
    },
}