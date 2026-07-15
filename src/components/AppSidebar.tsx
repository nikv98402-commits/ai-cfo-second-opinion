"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const demoCaseId = "north-distribution-q2";

const workspaceItems = [
  { label: "Разборы", href: "/", match: (pathname: string) => pathname === "/" },
  { label: "Создать кейс", href: "/cases/new", match: (pathname: string) => pathname === "/cases/new" },
  {
    label: "Загрузка данных",
    href: `/cases/${demoCaseId}/upload`,
    match: (pathname: string) => /^\/cases\/[^/]+\/upload$/.test(pathname)
  },
  {
    label: "Анализ",
    href: `/cases/${demoCaseId}/analyze`,
    match: (pathname: string) => /^\/cases\/[^/]+\/analyze$/.test(pathname)
  },
  {
    label: "Отчет",
    href: `/cases/${demoCaseId}/report`,
    match: (pathname: string) => /^\/cases\/[^/]+\/report$/.test(pathname)
  }
];

interface AppSidebarProps {
  aiProvider: string;
  aiModel: string;
  workspaceMode: string;
}

export function AppSidebar({ aiProvider, aiModel, workspaceMode }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="nav-title">Рабочая область</div>
      {workspaceItems.map((item) => (
        <Link className={`nav-item ${item.match(pathname) ? "active" : ""}`} href={item.href} key={item.href}>
          {item.label}
        </Link>
      ))}
      <div className="nav-title">Статус прототипа</div>
      <span className="nav-item status">{aiProvider}</span>
      <span className="nav-item status">{aiModel}</span>
      <span className="nav-item status">{workspaceMode}</span>
    </aside>
  );
}
