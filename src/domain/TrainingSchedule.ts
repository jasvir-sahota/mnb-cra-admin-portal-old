type schedule_items = {
  exercise: string,
  set: string,
  rep: string,
  rest: string,
  stretching: string,
  tempo: string,
  instructions: string,
  day: string
}

export type TrainingSchedule = {
  id: string,
  start_date: string,
  end_date: string,
  is_active: boolean,
  items: schedule_items[],
  notes: string[]
}
