import React, { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import BottomBar from "../Component/BottomBar";
import Header from "../Component/Header";

const Main = () => {
  const { pathname } = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div>
      <Header/>
      <Outlet></Outlet>
      {pathname.includes("/admin") || <BottomBar />}
    </div>
  );
};

export default Main;
