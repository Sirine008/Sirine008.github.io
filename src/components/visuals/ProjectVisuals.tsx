import { FacultyVisuals } from './FacultyVisuals'
import { SagemcomVisuals } from './SagemcomVisuals'
import { StockVisuals } from './StockVisuals'
import { ThniyetnaVisuals } from './ThniyetnaVisuals'

/** Project-specific explanatory visuals, placed between the architecture diagram and the decisions. */
export function ProjectVisuals({ slug }: { slug: string }) {
  switch (slug) {
    case 'grounded-quality-assistant':
      return <SagemcomVisuals />
    case 'thniyetna':
      return <ThniyetnaVisuals />
    case 'faculty-administration':
      return <FacultyVisuals />
    case 'stock-forecasting':
      return <StockVisuals />
    default:
      return null
  }
}
