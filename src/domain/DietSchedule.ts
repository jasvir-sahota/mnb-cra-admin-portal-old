type schedule_items = {
  food_item: string,
  instructions: string,
  day: string;
  time: string
}

export type DietSchedule = {
  id: string,
  start_date: string,
  end_date: string,
  is_active: boolean,
  items: schedule_items[],
  notes: string[]
}
