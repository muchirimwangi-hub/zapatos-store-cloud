"use client"

import { useState, useEffect, useMemo } from "react"
import { Country, State, City } from "country-state-city"

// Override cities for specific states where the package data is incomplete
const cityOverrides: Record<string, Record<string, string[]>> = {
  NG: {
    FC: ["Abaji", "Abuja Municipal (AMAC)", "Bwari", "Gwagwalada", "Kuje", "Kwali"],
  },
}

interface LocationSelectProps {
  countryValue: string
  stateValue: string
  cityValue: string
  onCountryChange: (countryCode: string) => void
  onStateChange: (stateCode: string) => void
  onCityChange: (cityName: string) => void
  className?: string
}

export function LocationSelect({
  countryValue,
  stateValue,
  cityValue,
  onCountryChange,
  onStateChange,
  onCityChange,
  className,
}: LocationSelectProps) {
  const countries = useMemo(() => Country.getAllCountries(), [])

  const states = useMemo(
    () => (countryValue ? State.getStatesOfCountry(countryValue) : []),
    [countryValue]
  )

  const cities = useMemo(() => {
    if (!countryValue || !stateValue) return []
    // Check for custom overrides first
    const override = cityOverrides[countryValue]?.[stateValue]
    if (override) {
      return override.map((name) => ({ name, country: countryValue, state: stateValue }))
    }
    return City.getCitiesOfState(countryValue, stateValue)
  }, [countryValue, stateValue])

  // Reset state and city when country changes
  const handleCountryChange = (code: string) => {
    onCountryChange(code)
    onStateChange("")
    onCityChange("")
  }

  // Reset city when state changes
  const handleStateChange = (code: string) => {
    onStateChange(code)
    onCityChange("")
  }

  const selectClass =
    "flex h-10 w-full luxury-border bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-zapatos-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zapatos-gold/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat pr-10"

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Country */}
        <div>
          <label className="block text-sm mb-2">Country *</label>
          <select
            required
            value={countryValue}
            onChange={(e) => handleCountryChange(e.target.value)}
            className={selectClass}
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* State */}
        <div>
          <label className="block text-sm mb-2">State *</label>
          <select
            required
            value={stateValue}
            onChange={(e) => handleStateChange(e.target.value)}
            disabled={!countryValue}
            className={selectClass}
          >
            <option value="">
              {countryValue ? "Select state" : "Select country first"}
            </option>
            {states.map((s) => (
              <option key={s.isoCode} value={s.isoCode}>
                {s.name}
              </option>
            ))}
          </select>
          {countryValue && states.length === 0 && (
            <input
              type="text"
              required
              placeholder="Enter state/province"
              value={stateValue}
              onChange={(e) => onStateChange(e.target.value)}
              className="flex h-10 w-full luxury-border bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-zapatos-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zapatos-gold/50 mt-2"
            />
          )}
        </div>

        {/* City */}
        <div>
          <label className="block text-sm mb-2">City *</label>
          {countryValue && stateValue && cities.length > 0 ? (
            <select
              required
              value={cityValue}
              onChange={(e) => onCityChange(e.target.value)}
              className={selectClass}
            >
              <option value="">Select city</option>
              {cities.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              required
              placeholder={
                !countryValue
                  ? "Select country first"
                  : !stateValue
                  ? "Select state first"
                  : "Enter city"
              }
              value={cityValue}
              onChange={(e) => onCityChange(e.target.value)}
              disabled={!countryValue || !stateValue}
              className="flex h-10 w-full luxury-border bg-transparent px-3 py-2 text-sm transition-colors placeholder:text-zapatos-charcoal/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zapatos-gold/50 disabled:cursor-not-allowed disabled:opacity-50"
            />
          )}
        </div>
      </div>
    </div>
  )
}
