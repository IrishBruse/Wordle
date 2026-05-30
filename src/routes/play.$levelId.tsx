import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/play/$levelId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/play/$levelId"!</div>
}
