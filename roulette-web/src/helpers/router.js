import GamePage from "../components/GamePage";
import LandingPage from "../components/LandingPage";
import NotFoundPage from "../components/NotFoundPage";
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
    {
        path: "/game/:gameCode",
        element: <GamePage />,
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
];

export default ROUTER_CONFIG;
