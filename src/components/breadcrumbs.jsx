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
          <BreadcrumbLink href="/" className="font-bold text-foreground">
            Meeting Assistant
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
