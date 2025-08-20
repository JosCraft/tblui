import { DynamicPivotTable } from "@/components/dynamic-pivot-table"

export default function App() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tabla Dinámica Interactiva</h1>
          <p className="text-muted-foreground">
            Arrastra las columnas para reorganizar los datos y generar gráficos automáticamente
          </p>
        </div>
        <DynamicPivotTable />
      </div>
    </main>
  )
}
