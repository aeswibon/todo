import { useEffect } from 'react'

import { transformIcons } from './icon'
import iconData from './UniconPaths.json'

export type IconName = keyof typeof iconData

export interface CareIconProps {
  icon?: IconName
  className?: string | undefined
  onClick?: React.MouseEventHandler<HTMLSpanElement> | undefined
  id?: string
}

/**
 * @param className icon class name
 * @returns icon component
 * @example ```<CareIcon className="care-l-hospital" /> ```
 *
 * @see [icon library](https://iconscout.com/unicons/)
 */
export default function Icon({ id, icon, className, onClick }: CareIconProps) {
  const effectiveClassName = icon ? `k-${String(icon)} ${className ?? ''}` : className

  useEffect(() => transformIcons(), [effectiveClassName])

  return (
    <span key={effectiveClassName} id={id} onClick={onClick}>
      <i className={` ${effectiveClassName}`} />
    </span>
  )
}
