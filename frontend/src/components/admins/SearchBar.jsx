import { useState, useEffect, useRef } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons'

function SearchBar({ value: externalValue, onChange, placeholder = 'Search...', debounceMs = 400 }) {
  const [internalValue, setInternalValue] = useState(externalValue || '')
  const timerRef = useRef(null)

  useEffect(() => {
    setInternalValue(externalValue || '')
  }, [externalValue])

  const handleChange = (e) => {
    const val = e.target.value
    setInternalValue(val)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onChange(val)
    }, debounceMs)
  }

  const handleClear = () => {
    setInternalValue('')
    clearTimeout(timerRef.current)
    onChange('')
  }

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  return (
    <InputGroup style={{ minWidth: 220 }}>
      <InputGroup.Text className="bg-white"><FontAwesomeIcon icon={faSearch} size="sm" /></InputGroup.Text>
      <Form.Control
        size="sm"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {internalValue && (
        <InputGroup.Text className="bg-white cursor-pointer" onClick={handleClear} style={{ cursor: 'pointer' }}>
          <FontAwesomeIcon icon={faXmark} />
        </InputGroup.Text>
      )}
    </InputGroup>
  )
}

export default SearchBar
