import {
  Home,
  SmartphoneNfc,
  UserPlus,
  Handshake,
  Calendar,
  Box,
  Users,
  Star,
  LayoutDashboardIcon
} from "lucide-react";

export const menuItems = [
  {
    id: 1,
    label: "Home",
    href: "/",
    icon: Home,
    current: true
  },
  {
    id: 2,
    label: "Products",
    href: "/products",
    icon: Handshake,
    current: false
  },
  {
    id: 3,
    label: "Contact",
    href: "/contact",
    icon: SmartphoneNfc,
    current: false
  },
  {
    id: 4,
    label: "About",
    href: "/about",
    icon: UserPlus,
    current: false
  },
];

export const dashboardMenu = [
  {
    id: 1,
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
    current: false
  },
  {
    id: 2,
    label: "Products",
    href: "/dashboard/products",
    icon: Handshake,
    current: false
  },
  {
    id: 3,
    label: "Category",
    href: "/dashboard/categories",
    icon: Box,
    current: false
  },
  {
    id: 4,
    label: "Bookings",
    href: "/dashboard/bookings",
    icon: Calendar,
    current: false
  },
  {
    id: 5,
    label: "Users",
    href: "/dashboard/users",
    icon: Users,
    current: false
  },
];
