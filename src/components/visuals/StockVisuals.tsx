import { useEffect, useState } from 'react'
import metrics from '../../content/data-stock-metrics.json'
import { Bars } from '../viz/Bars'
import { LineChart } from '../viz/LineChart'
import { useReveal } from '../viz/useReveal'
import { TableView, VizBlock } from '../viz/VizBlock'

type Ticker = 'AMZN' | 'DPZ' | 'BTC' | 'NFLX'
type ModelKey = 'naive' | 'ridge' | 'rf' | 'lstm'
interface Backtest {
  dates: string[]
  actual: number[]
  naive: number[]
  ridge: number[]
  rf: number[]
  lstm: number[]
}

const TICKERS: { key: Ticker; name: string }[] = [
  { key: 'AMZN', name: 'Amazon' },
  { key: 'DPZ', name: 'Domino’s' },
  { key: 'BTC', name: 'Bitcoin' },
  { key: 'NFLX', name: 'Netflix' },
]
const MODELS: { key: ModelKey; name: string; metricsName: string }[] = [
  { key: 'lstm', name: 'LSTM', metricsName: 'LSTM' },
  { key: 'rf', name: 'Random Forest', metricsName: 'Random Forest' },
  { key: 'ridge', name: 'Ridge', metricsName: 'Ridge Regression' },
  { key: 'naive', name: 'Naive (yesterday’s price)', metricsName: 'Naive (last value)' },
]
const BLUE = '#2f6f9f'
const OCHRE = '#b8781a'
const REPO = 'https://github.com/Sirine008/stock-market-prediction'

type Metrics = Record<Ticker, { best: string; models: Record<string, { rmse: number; mape: number; dir: number | null }> }>
const M = metrics as Metrics

const usd = (v: number) => (v >= 1000 ? `$${Math.round(v).toLocaleString('en-US')}` : `$${v.toFixed(2)}`)
const usdAxis = (v: number) => (v >= 1000 ? `$${Math.round(v).toLocaleString('en-US')}` : `$${Number(v.toFixed(2))}`)

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: { key: T; name: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <fieldset className="segmented">
      <legend className="mono">{label}</legend>
      <div>
        {options.map((o) => (
          <button key={o.key} type="button" aria-pressed={value === o.key} onClick={() => onChange(o.key)}>
            {o.name}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

function Explorer() {
  const [ticker, setTicker] = useState<Ticker>('AMZN')
  const [model, setModel] = useState<ModelKey>('lstm')
  const [range, setRange] = useState<'60' | 'all'>('60')
  const [data, setData] = useState<Partial<Record<Ticker, Backtest>>>({})
  const [error, setError] = useState(false)
  const { ref, className } = useReveal<HTMLDivElement>(0.1)

  useEffect(() => {
    if (data[ticker]) return
    let alive = true
    fetch(`/data/stock-${ticker}.json`)
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: Backtest) => alive && setData((prev) => ({ ...prev, [ticker]: d })))
      .catch(() => alive && setError(true))
    return () => {
      alive = false
    }
  }, [ticker, data])

  const d = data[ticker]
  const m = MODELS.find((x) => x.key === model)!
  const tm = M[ticker].models
  const start = d && range === '60' ? Math.max(0, d.dates.length - 60) : 0
  const slice = (a: number[]) => a.slice(start)
  const modelMetrics = tm[m.metricsName]
  const naive = tm['Naive (last value)']

  return (
    <div ref={ref}>
      <div className="viz-controls">
        <Segmented label="Asset" options={TICKERS} value={ticker} onChange={setTicker} />
        <Segmented label="Model" options={MODELS} value={model} onChange={setModel} />
        <Segmented
          label="Period"
          options={[
            { key: '60', name: 'Last 60 days' },
            { key: 'all', name: 'Full test year' },
          ]}
          value={range}
          onChange={setRange}
        />
      </div>

      <div className="explorer">
        <div className="explorer-chart">
          <ul className="legend chart-legend" aria-label="Legend">
            <li>
              <span className="line-key" style={{ background: BLUE }} aria-hidden="true" />
              Actual closing price
            </li>
            <li>
              <span className="line-key" style={{ background: OCHRE }} aria-hidden="true" />
              {m.name} — next-day prediction
            </li>
          </ul>
          {d ? (
            <LineChart
              dates={d.dates.slice(start)}
              series={[
                { key: 'actual', label: 'Actual', color: BLUE, values: slice(d.actual) },
                { key: model, label: m.name, color: OCHRE, values: slice(d[model]) },
              ]}
              format={usdAxis}
              label={`${TICKERS.find((t) => t.key === ticker)!.name}: actual closing price and ${m.name} next-day prediction on the test period`}
              animKey={`${ticker}-${model}-${range}`}
              reveal={className}
            />
          ) : (
            <div className="chart-placeholder mono">{error ? 'The chart data could not be loaded.' : 'Loading the backtest…'}</div>
          )}
        </div>
        <dl className="explorer-stats">
          <div>
            <dt>Test RMSE</dt>
            <dd>
              {usd(modelMetrics.rmse)}
              <span>naive: {usd(naive.rmse)}</span>
            </dd>
          </div>
          <div>
            <dt>Test MAPE</dt>
            <dd>
              {modelMetrics.mape.toFixed(2)} %<span>naive: {naive.mape.toFixed(2)} %</span>
            </dd>
          </div>
          <div>
            <dt>Direction right</dt>
            <dd>
              {modelMetrics.dir === null ? '—' : `${modelMetrics.dir.toFixed(1)} %`}
              <span>coin flip: 50 %</span>
            </dd>
          </div>
        </dl>
      </div>
      <p className="mono muted chart-hint">Hover or focus the chart, then use the arrow keys, to read any day.</p>

      <h3 className="viz-subtitle">Test error of every model — {TICKERS.find((t) => t.key === ticker)!.name}</h3>
      <Bars
        label={`Test RMSE by model for ${ticker}`}
        max={Math.max(...Object.values(tm).map((v) => v.rmse)) * 1.15}
        format={usd}
        rows={MODELS.map((x) => ({
          label: x.name,
          value: tm[x.metricsName].rmse,
          tone: x.key === model ? 'accent' : 'muted',
          note: [
            x.key === 'naive' ? 'baseline' : '',
            Math.min(...Object.values(tm).map((v) => v.rmse)) === tm[x.metricsName].rmse ? 'lowest error' : '',
            M[ticker].best === x.metricsName ? 'chosen on validation' : '',
          ]
            .filter(Boolean)
            .join(' · ') || undefined,
        }))}
      />
      <TableView
        caption="Test metrics for every asset and model"
        head={['Asset · model', 'RMSE', 'MAPE', 'Direction right']}
        rows={TICKERS.flatMap((t) =>
          MODELS.map((x) => {
            const v = M[t.key].models[x.metricsName]
            return [`${t.key} · ${x.name}`, usd(v.rmse), `${v.mape.toFixed(2)} %`, v.dir === null ? '—' : `${v.dir.toFixed(1)} %`]
          }),
        )}
      />
    </div>
  )
}

export function StockVisuals() {
  return (
    <>
      <VizBlock
        id="stock-explorer"
        kicker="Interactive · real backtest"
        title="Watch the predictions follow the price — one day late"
        lead={
          <p>
            Each line is the real test-period output of the models (June 2018 – May 2019). Zoom in on the last 60 days: every
            model’s line looks like the actual price shifted by a day. That is why the naive “tomorrow = today” forecast is so
            hard to beat, and why the error bars below are almost identical.
          </p>
        }
        source={{ text: 'reports/backtest_<asset>.csv and metrics_<asset>.json in the repository.', href: `${REPO}/tree/main/reports`, label: 'reports/' }}
      >
        <Explorer />
      </VizBlock>

      <VizBlock
        id="stock-mape"
        kicker="Before / after"
        title="One change in the target, a 26× smaller error"
        lead={
          <p>
            The first version predicted scaled raw prices. In the test year, Amazon traded above every price seen in training,
            and models cannot extrapolate there. Predicting the next-day % change instead made the inputs scale-free.
          </p>
        }
        source={{ text: 'README, “What the results mean”, and metrics_AMZN.json.', href: REPO, label: 'README' }}
      >
        <Bars
          label="Amazon test MAPE before and after switching to percentage-change targets"
          max={45}
          format={(v) => `${v.toFixed(v < 10 ? 2 : 0)} %`}
          rows={[
            { label: 'Random Forest · raw prices', value: 42, tone: 'muted', note: 'first version' },
            { label: 'Random Forest · % change', value: M.AMZN.models['Random Forest'].mape, tone: 'accent' },
            { label: 'LSTM · raw prices', value: 18, tone: 'muted', note: 'first version' },
            { label: 'LSTM · % change', value: M.AMZN.models.LSTM.mape, tone: 'accent' },
          ]}
        />
      </VizBlock>
    </>
  )
}
