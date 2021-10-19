export type TrainingSchedule = {
  id: string,
  start_date: string,
  end_date: string,
  is_active: boolean,
  notes: string[],
  items: {
    id: string,
    stretching: string,
    day: string,
    set: number,
    rep: number,
    excercise: string,
    instructions: string,
    tempo: string
  }[]
}
