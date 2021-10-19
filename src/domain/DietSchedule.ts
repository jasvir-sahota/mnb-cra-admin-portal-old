type DietItem = {
  day: string
}

export type DietSchedule = {
  id: string,
  start_date: string,
  end_date: string,
  is_active: boolean,
  notes: string[],
  items: {
    day: string,
    food_item: string,
    instructions: string,
    time: string
  }[]
}
