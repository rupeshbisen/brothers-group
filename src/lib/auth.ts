// Authentication utility functions

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

// Cookie utilities
function setCookie(name: string, value: string, days: number = 7) {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;

  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function deleteCookie(name: string) {
  if (typeof window === "undefined") return;

  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

export function getAdminUser(): AdminUser | null {
  if (typeof window === "undefined") return null;

  // Try localStorage first (for backward compatibility)
  const isLoggedIn = localStorage.getItem("adminLoggedIn");
  if (isLoggedIn) {
    return {
      id: localStorage.getItem("adminId") || "",
      email: localStorage.getItem("adminEmail") || "",
      name: localStorage.getItem("adminName") || "",
      role: localStorage.getItem("adminRole") || "",
    };
  }

  // Try cookie as fallback
  const adminSession = getCookie("admin_session");
  if (adminSession) {
    try {
      return JSON.parse(adminSession);
    } catch {
      return null;
    }
  }

  return null;
}

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;

  // Check localStorage first
  if (localStorage.getItem("adminLoggedIn") === "true") return true;

  // Check cookie as fallback
  return getCookie("admin_session") !== null;
}

export function setAdminSession(user: AdminUser): void {
  if (typeof window === "undefined") return;

  // Set localStorage (for backward compatibility)
  localStorage.setItem("adminLoggedIn", "true");
  localStorage.setItem("adminId", user.id);
  localStorage.setItem("adminEmail", user.email);
  localStorage.setItem("adminName", user.name);
  localStorage.setItem("adminRole", user.role);

  // Set cookie for middleware
  setCookie("admin_session", JSON.stringify(user), 7);
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;

  // Clear localStorage
  localStorage.removeItem("adminLoggedIn");
  localStorage.removeItem("adminEmail");
  localStorage.removeItem("adminRole");
  localStorage.removeItem("adminName");
  localStorage.removeItem("adminId");

  // Clear cookie
  deleteCookie("admin_session");
}

export function hasAdminRole(
  requiredRole: "super_admin" | "admin" = "admin"
): boolean {
  const user = getAdminUser();
  if (!user) return false;

  const roleHierarchy = {
    super_admin: 2,
    admin: 1,
  };

  const userRoleLevel =
    roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole];

  return userRoleLevel >= requiredRoleLevel;
}
