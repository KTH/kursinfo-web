export type Reservation = {
  id: number
  start: Date
  end: Date
  typename: string
  typedesc: string
  lastchanged: Date
  lastrevised: Date
  locations: Location[]
  staffs: Staff[]
  programmes: Programme[]
  status: string
  courses: Course[]
  offerings: Offering[]
  examCodes: any[]
  department?: Department
  description?: string
}

export type Course = {
  id: string
  description: string
}

export type Department = {
  name: string
  code: string
}

export type Location = {
  id: string
  name: string
}

export type Offering = {
  id: string
  course: Course
  semester: string
  ladokId: string
}

export type Programme = {
  code: string
  year: number
  specialisation?: string
}

export type Staff = {
  kthId: string
  fullName: string
  acronym: string
}
