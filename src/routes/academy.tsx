import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/academy")({
  component: AcademyLayout,
});

function AcademyLayout() {
  return <Outlet />;
}
