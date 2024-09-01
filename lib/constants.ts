import {
    Home,
    SmartphoneNfc,
    UserPlus,
    LayoutDashboardIcon,
    Boxes,
    HandshakeIcon,
    CalendarClockIcon,
    Users2Icon,
    Star
  } from "lucide-react";
  
  
  
  export const menuItems = [
    {
        id: 1,
        label: "Home",
        href: "/",
        icon: Home,
    },
    {
        id: 2,
        label: "Products",
        href: "/products",
        icon: HandshakeIcon,
        color: '#39F4B3'
    },
    {   id: 3, 
        label: "Contact", 
        href: "/contact", 
        icon: SmartphoneNfc 
    },
    {
      id: 4,
      label: "About",
      href: "/about",
      icon: UserPlus,
    },
  ];
  
  export const dashboardMenu = [
    {
      id: 1,
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboardIcon,
      color: 'text-sky-500'
    },
  
    {
      id: 2,
      label: "Products",
      href: "/dashboard/products",
      icon: HandshakeIcon,
      color: '#39F4B3'
    },
  
  
    {
      id: 3,
      label: "Category",
      href: "/dashboard/categories",
      icon: Boxes,
      color: 'text-sky-500'
    },
  
    {
      id: 4,
      label: "Bookings",
      href: "/dashboard/bookings",
      icon: CalendarClockIcon,
      color: '#39F4B3'
    },
  
    {
      id: 5,
      label: "Users",
      href: "/dashboard/users",
      icon: Users2Icon,
      color: '#39F4B3'
    },
  
  ];
  