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
import  ModeToggle  from "./modetoggle"

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
    title: "Emails",
    href: "/email",
    description: "View and manage your email communications"
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
          <div className="hidden md:flex items-center space-x-4">
            <NavigationMenu>
              <NavigationMenuList>
                {routes.map((route) => (
                  <NavigationMenuItem key={route.href}>
                    <Link href={route.href} legacyBehavior passHref>
                      <NavigationMenuLink 
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300",
                          pathname === route.href && "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                        )}
                      >
                        {route.title}
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            <ModeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center justify-between w-full">
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
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors text-orange-500 hover:bg-orange-100 hover:text-orange-700 dark:text-orange-400 dark:hover:bg-orange-900 dark:hover:text-orange-300",
                        pathname === route.href && "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300"
                      )}
                    >
                      <div className="text-sm font-medium leading-none">{route.title}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {route.description}
                      </p>
                    </Link>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <ModeToggle />
                </div>
              </SheetContent>
            </Sheet>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  )
}

