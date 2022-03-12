import defaultSettings from '@/settings'

const title = defaultSettings.title || 'spms'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
