'use client'

import * as React from 'react'
import { TagInput, type Tag } from 'emblor'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'

interface SkillTagInputProps {
  name: string
  label: string
  placeholder?: string
}

export function SkillTagInput({ name, label, placeholder }: SkillTagInputProps) {
  const { control, setValue, watch } = useFormContext()
  const tags = watch(name) as Tag[] || []

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-col items-start">
          <FormLabel>{label}</FormLabel>
          <FormControl className="w-full">
            <TagInput
              {...field}
              placeholder={placeholder || "Add skills..."}
              tags={tags}
              className="sm:min-w-[450px]"
              setTags={(newTags) => {
                setValue(name, newTags)
              }}
              activeTagIndex={null}
              setActiveTagIndex={() => {}}
            />
          </FormControl>
          <FormDescription>
            Press enter or comma to add a skill.
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
