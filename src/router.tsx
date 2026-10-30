import { Outlet, createRootRoute, createRoute, createRouter, useParams } from "@tanstack/react-router";
import { Layout } from "./components/Layout";
import { AlunoDetalhePage } from "./pages/AlunoDetalhePage";
import { AlunosPage } from "./pages/AlunosPage";
import { HomePage } from "./pages/HomePage";
import { NovoAlunoPage } from "./pages/NovoAlunoPage";

/*
 * Rotas do site (TanStack Router, definidas em código):
 *   /              → HomePage
 *   /alunos        → lista
 *   /alunos/novo   → cadastro
 *   /alunos/:id    → detalhe
 */
const rootRoute = createRootRoute({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
  notFoundComponent: () => (
    <div className="py-16 text-center">
      <h1 className="text-3xl">Página não encontrada</h1>
      <p className="mt-3 text-muted">O endereço que você abriu não existe.</p>
    </div>
  ),
});

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: HomePage });

const alunosRoute = createRoute({ getParentRoute: () => rootRoute, path: "/alunos", component: AlunosPage });

const novoAlunoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alunos/novo",
  component: NovoAlunoPage,
});

const alunoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/alunos/$id",
  component: function AlunoRoute() {
    const { id } = useParams({ from: "/alunos/$id" });
    return <AlunoDetalhePage id={id} />;
  },
});

const routeTree = rootRoute.addChildren([homeRoute, alunosRoute, novoAlunoRoute, alunoRoute]);

export const router = createRouter({ routeTree, defaultPreload: "intent" });

// Faz o TypeScript conhecer as rotas: erra se um <Link to="..."> apontar para uma rota que não existe.
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
