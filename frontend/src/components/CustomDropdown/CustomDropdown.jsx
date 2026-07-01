import { useState, useRef, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import './CustomDropdown.css'

export default function CustomDropdown({
  options = [],
  value = '',
  onChange,
  placeholder = '',
  locale,
  icon: IconComponent,
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlightIndex, setHighlightIndex] = useState(-1)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const listRef = useRef(null)

  const selected = useMemo(() => options.find(o => String(o.value) === String(value)), [options, value])

  const filtered = useMemo(() => {
    if (!query) return options
    const q = query.toLowerCase()
    return options.filter(o => o.label?.toLowerCase().includes(q))
  }, [options, query])

  useEffect(() => {
    if (!open) { setQuery(''); setHighlightIndex(-1) }
  }, [open])

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open && listRef.current && highlightIndex >= 0) {
      const item = listRef.current.children[highlightIndex]
      item?.scrollIntoView({ block: 'nearest' })
    }
  }, [highlightIndex, open])

  const select = (opt) => {
    onChange?.({ target: { value: opt.value } })
    setOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') { setOpen(true); e.preventDefault() }
      return
    }
    switch (e.key) {
      case 'ArrowDown': e.preventDefault(); setHighlightIndex(i => Math.min(i + 1, filtered.length - 1)); break
      case 'ArrowUp': e.preventDefault(); setHighlightIndex(i => Math.max(i - 1, 0)); break
      case 'Enter': e.preventDefault(); if (filtered[highlightIndex]) select(filtered[highlightIndex]); break
      case 'Escape': e.preventDefault(); setOpen(false); break
    }
  }

  return (
    <div className={`cd-wrapper ${open ? 'cd-wrapper--open' : ''}`} ref={containerRef}>
      <div className="cd-input" onClick={() => { setOpen(true); inputRef.current?.focus() }}>
        {IconComponent && (
          <span className="cd-input__icon">
            <FontAwesomeIcon icon={IconComponent} />
          </span>
        )}
        <input
          ref={inputRef}
          className="cd-input__field"
          placeholder={selected ? selected.label : placeholder}
          value={open ? query : (selected ? selected.label : '')}
          onChange={e => { setQuery(e.target.value); setOpen(true); setHighlightIndex(-1) }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
        />
        <span className={`cd-input__chevron ${open ? 'cd-input__chevron--open' : ''}`}>
          <FontAwesomeIcon icon={faChevronDown} />
        </span>
      </div>

      {open && (
        <div className="cd-dropdown" ref={listRef}>
          {filtered.length === 0 ? (
            <div className="cd-dropdown__empty">
              {locale === 'ar' ? 'لا توجد نتائج' : 'No results'}
            </div>
          ) : (
            filtered.map((opt, i) => {
              const isActive = String(opt.value) === String(value)
              return (
                <div
                  key={opt.value}
                  className={`cd-option ${isActive ? 'cd-option--selected' : ''} ${i === highlightIndex ? 'cd-option--highlighted' : ''}`}
                  onMouseDown={() => select(opt)}
                  onMouseEnter={() => setHighlightIndex(i)}
                >
                  {opt.label}
                  {isActive && <span className="cd-option__check">✓</span>}
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
