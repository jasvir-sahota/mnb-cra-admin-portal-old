type Diet = {
  diet_id: string,
  name: string,
  food_item: string,
  day: string,
  time: string,
  instructions: string,
}

type DietPlan = {
  id: string,
  name: string,
  category: string,
  items: Diet[] | [],
  notes: string[]
}

type DietSchedule = {
  id: string,
  start_date: string,
  end_date: string,
  notes: string[],
  plan: DietPlan
}

export type {
  Diet,
  DietPlan,
  DietSchedule
}