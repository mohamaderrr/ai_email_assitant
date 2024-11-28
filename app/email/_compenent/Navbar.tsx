"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from 'lucide-react'

const routes = [
  {
    title: "Analytics Dashboard",
    href: "/dashboard",
    description: "View detailed analytics and metrics for your business"
  },
  {
    title: "Client Data",
    href: "/clients",
    description: "Manage and view your client information"
  },
  {
    title: "Email Templates",
    href: "/email-templates",
    description: "Create and manage email templates"
  },
  {
    title: "Profile",
    href: "/profile",
    description: "View and edit your profile settings"
  }
]

export default function MainNav() {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center justify-center w-full space-x-4">
          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                {routes.map((route) => (
                  <NavigationMenuItem key={route.href}>
                    <Link href={route.href} legacyBehavior passHref>
                      <NavigationMenuLink 
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "text-orange-500 hover:text-orange-600",
                          pathname === route.href && "bg-orange-100 text-orange-700"
                        )}
                      >
                        {route.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>
                    Navigate through different sections of the application
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  {routes.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors text-orange-500 hover:bg-orange-100 hover:text-orange-700 focus:bg-orange-100 focus:text-orange-700",
                        pathname === route.href && "bg-orange-100 text-orange-700"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">{route.title}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {route.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  )
}

