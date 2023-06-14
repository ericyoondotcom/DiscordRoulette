import LandingPage from "../components/LandingPage";
import UploadPage from "../components/UploadPage";

const ROUTER_CONFIG = [
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/upload",
        element: <UploadPage />,
    },
];

export default ROUTER_CONFIG;
