import { useState, useEffect } from 'react'

interface DepartmentSummary {
  departamento: string
  total_entregas: number
}

interface SummaryData {
  total_registros: number
  total_entregas: number
  media_entregas: number
  por_departamento: DepartmentSummary[]
}

interface RecordItem {
  id: number
  funcionario_id: number
  funcionario_nome: string
  departamento: string
  data_referencia: string
  quantidade_entregas: number
  observacao?: string
}

function App() {
  const [summary, setSummary] = useState<SummaryData | null>(null)
  const [records, setRecords] = useState<RecordItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [summaryRes, recordsRes] = await Promise.all([
        fetch('http://localhost:8080/summary'),
        fetch('http://localhost:8080/records')
      ])

      if (!summaryRes.ok || !recordsRes.ok) {
        throw new Error()
      }

      setSummary(await summaryRes.json())
      setRecords(await recordsRes.json())
    } catch {
      setError('Erro ao carregar dados do servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const maxDeliveries = summary?.por_departamento?.length
    ? Math.max(...summary.por_departamento.map(d => d.total_entregas), 1)
    : 1

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans text-gray-800">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h1 className="text-xl font-bold">Painel de Indicadores</h1>
        <button
          onClick={fetchData}
          className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Atualizar
        </button>
      </div>

      {isLoading && <p className="text-gray-500 py-8 text-center">Carregando dados...</p>}

      {error && !isLoading && (
        <div className="p-4 mb-6 bg-red-50 text-red-700 border border-red-200 rounded">
          <p>{error}</p>
          <button onClick={fetchData} className="mt-2 text-sm underline font-medium">
            Tentar novamente
          </button>
        </div>
      )}

      {!isLoading && !error && records.length === 0 && (
        <p className="text-gray-500 py-8 text-center">Nenhum registro encontrado.</p>
      )}

      {!isLoading && !error && summary && records.length > 0 && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border rounded bg-gray-50">
              <span className="text-sm text-gray-500 block">Total de Registros</span>
              <span className="text-2xl font-bold">{summary.total_registros}</span>
            </div>
            <div className="p-4 border rounded bg-gray-50">
              <span className="text-sm text-gray-500 block">Total de Entregas</span>
              <span className="text-2xl font-bold text-blue-600">{summary.total_entregas}</span>
            </div>
          </div>

          <div className="border rounded p-4">
            <h2 className="font-bold text-sm mb-3 text-gray-700">Entregas por Departamento</h2>
            <div className="space-y-2">
              {summary.por_departamento.map(item => (
                <div key={item.departamento}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{item.departamento}</span>
                    <span className="font-semibold">{item.total_entregas}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded h-2">
                    <div
                      className="bg-blue-600 h-2 rounded"
                      style={{ width: `${Math.round((item.total_entregas / maxDeliveries) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border rounded overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 border-b text-xs text-gray-600">
                <tr>
                  <th className="p-3">Funcionário</th>
                  <th className="p-3">Departamento</th>
                  <th className="p-3">Data</th>
                  <th className="p-3 text-right">Qtd</th>
                  <th className="p-3">Observação</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {records.map(r => (
                  <tr key={r.id}>
                    <td className="p-3 font-medium">{r.funcionario_nome}</td>
                    <td className="p-3">{r.departamento}</td>
                    <td className="p-3">{r.data_referencia}</td>
                    <td className="p-3 text-right font-bold text-blue-600">{r.quantidade_entregas}</td>
                    <td className="p-3 text-gray-500">{r.observacao || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
