import { useEffect } from "react";
import { useLocation } from "react-router-dom";

type RouteChangeCallback = () => void;

function useRouteChange(callback: RouteChangeCallback) {
  const { key } = useLocation();
  useEffect(() => callback(), [key]);
}

export { useRouteChange };
