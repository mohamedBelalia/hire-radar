"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

function formatDate(date: Date | undefined) {
  if (!date) return ""
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  })
}

function isValidDate(date: Date | undefined) {
  return date instanceof Date && !isNaN(date.getTime())
}

interface Calendar28Props {
  value?: string
  onChange?: (value: string) => void
}

export function Calendar28({ value, onChange }: Calendar28Props) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(date)
  const [internalValue, setInternalValue] = React.useState(formatDate(date))

  // Sync internal state when parent changes value
  React.useEffect(() => {
    if (value) {
      const newDate = new Date(value)
      setDate(newDate)
      setMonth(newDate)
      setInternalValue(formatDate(newDate))
    }
  }, [value])

  const handleChange = (val: string) => {
    setInternalValue(val)
    const newDate = new Date(val)
    if (isValidDate(newDate)) {
      setDate(newDate)
      setMonth(newDate)
      onChange && onChange(formatDate(newDate))
    }
  }

  return (
    <div className="flex flex-col gap-3 mt-2">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={internalValue}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(selectedDate) => {
                setDate(selectedDate)
                const formatted = formatDate(selectedDate)
                setInternalValue(formatted)
                onChange && onChange(formatted)
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
