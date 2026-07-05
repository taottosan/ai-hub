import ProviderDetailPageContent from './page-content'

export function generateStaticParams() {
  return [
    { name: 'inmemory' },
    { name: 'mem0' },
    { name: 'honcho' },
    { name: 'obsidian' },
    { name: 'skills' },
    { name: 'archive' },
  ]
}

export default async function ProviderDetailPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  return <ProviderDetailPageContent name={name} />
}
