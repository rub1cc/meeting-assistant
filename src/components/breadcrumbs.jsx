import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";

export function Breadcrumbs({ paths = [] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            className="font-bold text-foreground flex items-center gap-1"
          >
            <p>Meeting Assistant</p>
            <p className="text-[8px] font-bold border border-neutral-500 rounded-sm px-1 flex h-4 justify-center items-center">
              BETA
            </p>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {paths.map((item) => (
          <Fragment key={item.label}>
            <BreadcrumbSeparator className="hidden md:flex">
              /
            </BreadcrumbSeparator>
            <BreadcrumbItem className="hidden md:flex">
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                item.label
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
